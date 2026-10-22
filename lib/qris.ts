import "server-only";
import QRCode from "qrcode";

/**
 * Healthila's own static QRIS (BCA, NMID ID1024358076684, printed sticker
 * "A01"). For website orders it is turned into a QRIS with the amount filled
 * in: point of initiation 11 → 12 (dynamic), tag 54 = amount, new CRC.
 * Payments still land in the same merchant account.
 */
const STATIC_QRIS =
  process.env.QRIS_PAYLOAD ||
  "00020101021126650013ID.CO.BCA.WWW011893600014000265735702150008850026573570303UKE51440014ID.CO.QRIS.WWW0215ID10243580766840303UKE5204549953033605802ID5909Healthila6006MALANG61056514962070703A01630441AF";

type Tlv = [tag: string, value: string];

function parse(payload: string): Tlv[] {
  const out: Tlv[] = [];
  for (let i = 0; i < payload.length; ) {
    const tag = payload.slice(i, i + 2);
    const len = Number(payload.slice(i + 2, i + 4));
    out.push([tag, payload.slice(i + 4, i + 4 + len)]);
    i += 4 + len;
  }
  return out;
}

const field = ([tag, value]: Tlv) => `${tag}${String(value.length).padStart(2, "0")}${value}`;

/** CRC-16/CCITT-FALSE as required by EMVCo / QRIS. */
export function crc16(data: string): string {
  let crc = 0xffff;
  for (const byte of Buffer.from(data, "utf8")) {
    crc ^= byte << 8;
    for (let i = 0; i < 8; i++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

/** QRIS payload with a fixed amount (whole rupiah). */
export function qrisWithAmount(amount: number, base = STATIC_QRIS): string {
  if (!Number.isInteger(amount) || amount <= 0 || amount > 99_999_999) throw new Error("invalid amount");
  const fields = parse(base).filter(([tag]) => tag !== "63" && tag !== "54");
  const out = fields.map(([tag, value]): Tlv => (tag === "01" ? [tag, "12"] : [tag, value]));
  // Tags are in ascending order; amount (54) goes right after currency (53).
  const at = out.findIndex(([tag]) => Number(tag) > 54);
  out.splice(at < 0 ? out.length : at, 0, ["54", String(amount)]);
  const body = out.map(field).join("") + "6304";
  return body + crc16(body);
}

/** SVG markup of the QR code for `payload`. */
export function qrSvg(payload: string): Promise<string> {
  return QRCode.toString(payload, { type: "svg", errorCorrectionLevel: "M", margin: 2 });
}
