// Barcode scanning + lookup in Open Food Facts (free, open food database, no key needed).
// Exact label numbers for packaged food, so no AI is needed for those.
import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";
import { X, Check, Loader2 } from "lucide-react";

const PINE = "var(--pine)";
const INK = "var(--ink)";
const MUTED = "var(--muted)";
const LINE = "var(--line)";
const CARD = "var(--card)";
const PANEL = "var(--panel)";
const OVER = "var(--over)";
const BTNG = "var(--btn-grad)";
const BTNP = "var(--btn-alt)";
const inputStyle = { background: CARD, border: `1.5px solid ${LINE}`, color: INK, borderRadius: 14 };

const FORMATS = [BarcodeFormat.EAN_13, BarcodeFormat.EAN_8, BarcodeFormat.UPC_A, BarcodeFormat.UPC_E];

function makeReader(tryHarder = false) {
  const hints = new Map();
  hints.set(DecodeHintType.POSSIBLE_FORMATS, FORMATS);
  if (tryHarder) hints.set(DecodeHintType.TRY_HARDER, true);
  return new BrowserMultiFormatReader(hints);
}

/** Looks for a product barcode in a photo. Returns the number, or null. */
export async function findBarcodeInImage(dataUrl) {
  try {
    const result = await makeReader(true).decodeFromImageUrl(dataUrl);
    return result?.getText() || null;
  } catch {
    return null;
  }
}

const round1 = (n) => Math.round(n * 10) / 10;

/** Looks a barcode up in Open Food Facts. Throws an Error with a plain reason. */
export async function lookupBarcode(code) {
  const clean = String(code).replace(/\D/g, "");
  if (clean.length < 8) throw new Error("That barcode number looks too short.");
  let res;
  try {
    res = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${clean}.json?fields=product_name,product_name_en,brands,nutriments,serving_size,serving_quantity,product_quantity,quantity`
    );
  } catch {
    throw new Error("Couldn't reach the food database. Check your connection.");
  }
  const data = res.ok || res.status === 404 ? await res.json().catch(() => null) : null;
  const p = data?.product;
  if (!data || data.status !== 1 || !p) {
    throw new Error("This product isn't in the food database yet. Take a photo of the label or describe it instead.");
  }
  const n = p.nutriments || {};
  let kcal = Number(n["energy-kcal_100g"]);
  if (!Number.isFinite(kcal) && Number.isFinite(Number(n.energy_100g))) kcal = Number(n.energy_100g) / 4.184;
  if (!Number.isFinite(kcal)) {
    throw new Error("The database has this product but no nutrition numbers. Take a photo of the label instead.");
  }
  const unit = /\d\s*(ml|cl|l)\b/i.test(p.quantity || "") || /\d\s*(ml|cl)\b/i.test(p.serving_size || "") ? "ml" : "g";
  const name = (p.product_name || p.product_name_en || "Packaged food").trim();
  const brand = (p.brands || "").split(",")[0].trim();
  return {
    code: clean,
    name: brand && !name.toLowerCase().includes(brand.toLowerCase()) ? `${brand} ${name}` : name,
    unit,
    per100: {
      calories: kcal,
      protein: Number(n.proteins_100g) || 0,
      carbs: Number(n.carbohydrates_100g) || 0,
      fat: Number(n.fat_100g) || 0,
    },
    serving: Number(p.serving_quantity) > 0 ? Number(p.serving_quantity) : null,
    servingLabel: p.serving_size || "",
    pack: Number(p.product_quantity) > 0 ? Number(p.product_quantity) : null,
  };
}

/** Full-screen live camera scanner with a manual number fallback. */
export function BarcodeScanner({ onCode, onClose }) {
  const videoRef = useRef(null);
  const [camError, setCamError] = useState("");
  const [manual, setManual] = useState("");

  useEffect(() => {
    let controls = null;
    let stopped = false;
    const reader = makeReader();
    reader
      .decodeFromConstraints({ video: { facingMode: { ideal: "environment" } }, audio: false }, videoRef.current, (result, _err, c) => {
        if (result && !stopped) {
          stopped = true;
          c.stop();
          navigator.vibrate?.(60);
          onCode(result.getText());
        }
      })
      .then((c) => {
        controls = c;
        if (stopped) c.stop();
      })
      .catch((e) => {
        setCamError(
          e?.name === "NotAllowedError"
            ? "Camera access was blocked. Allow it in your browser settings, or type the number below."
            : "The camera couldn't start. Type the number under the barcode instead."
        );
      });
    return () => {
      stopped = true;
      controls?.stop();
    };
  }, []);

  const submitManual = () => {
    const code = manual.replace(/\D/g, "");
    if (code.length >= 8) onCode(code);
  };

  return (
    <div
      role="dialog"
      aria-label="Scan a barcode"
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 flex flex-col"
      style={{ background: "#000", zIndex: 70, paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <span className="font-bold text-lg">Scan a barcode</span>
        <button onClick={onClose} aria-label="Close scanner" style={{ padding: 8 }}>
          <X size={24} />
        </button>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <video ref={videoRef} playsInline muted autoPlay className="absolute inset-0 w-full h-full" style={{ objectFit: "cover" }} />
        {!camError && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div style={{ width: "78%", maxWidth: 340, height: 150, border: "3px solid #FF6FD0", borderRadius: 18, boxShadow: "0 0 0 9999px rgba(0,0,0,0.45)" }} />
          </div>
        )}
        <p className="absolute inset-x-0 text-center text-white text-sm px-6" style={{ bottom: 16 }}>
          {camError || "Hold the barcode inside the box. It scans on its own."}
        </p>
      </div>

      <div className="p-4 flex gap-2" style={{ background: CARD }}>
        <input
          value={manual}
          onChange={(e) => setManual(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitManual()}
          inputMode="numeric"
          placeholder="Or type the number"
          aria-label="Barcode number"
          className="flex-1 min-w-0 px-4 py-3 outline-none"
          style={inputStyle}
        />
        <button
          onClick={submitManual}
          disabled={manual.replace(/\D/g, "").length < 8}
          className="px-5 font-bold text-white"
          style={{ borderRadius: 14, background: BTNG, opacity: manual.replace(/\D/g, "").length < 8 ? 0.5 : 1 }}
        >
          Look up
        </button>
      </div>
    </div>
  );
}

/** Lets the person pick how much they had, then hands back a meal draft. */
export function PortionPicker({ product, onUse, onBack }) {
  const u = product.unit;
  const options = [];
  if (product.serving) options.push({ amount: product.serving, label: `1 serving · ${round1(product.serving)} ${u}` });
  if (product.pack && product.pack !== product.serving) options.push({ amount: product.pack, label: `Whole pack · ${round1(product.pack)} ${u}` });
  if (!options.some((o) => o.amount === 100)) options.push({ amount: 100, label: `100 ${u}` });

  const [amount, setAmount] = useState(options[0].amount);
  const [custom, setCustom] = useState("");
  const amt = custom !== "" ? Math.max(0, parseFloat(custom.replace(",", ".")) || 0) : amount;
  const f = amt / 100;
  const totals = {
    calories: Math.round(product.per100.calories * f),
    protein: Math.round(product.per100.protein * f),
    carbs: Math.round(product.per100.carbs * f),
    fat: Math.round(product.per100.fat * f),
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-2">
        <Check size={20} style={{ color: PINE, marginTop: 3, flexShrink: 0 }} />
        <div className="min-w-0">
          <p className="font-bold text-lg leading-snug" style={{ color: INK }}>{product.name}</p>
          <p className="text-sm" style={{ color: MUTED }}>
            Per 100 {u}: {Math.round(product.per100.calories)} kcal · {round1(product.per100.protein)} g protein
          </p>
        </div>
      </div>

      <p className="text-sm font-semibold" style={{ color: MUTED }}>How much did you have?</p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = custom === "" && amount === o.amount;
          return (
            <button
              key={o.label}
              onClick={() => {
                setAmount(o.amount);
                setCustom("");
              }}
              aria-pressed={active}
              className="px-3 py-2 text-sm font-semibold"
              style={{ borderRadius: 14, background: active ? BTNP : PANEL, color: active ? "#fff" : INK }}
            >
              {o.label}
            </button>
          );
        })}
      </div>
      <label className="flex items-center gap-2 text-sm font-semibold" style={{ color: MUTED }}>
        Other amount
        <input
          type="number"
          inputMode="decimal"
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder={String(round1(amount))}
          className="w-24 px-3 py-2 outline-none"
          style={inputStyle}
          aria-label={`Amount in ${u}`}
        />
        {u}
      </label>

      <p className="text-base" style={{ color: INK }}>
        <b>{totals.calories} kcal</b> · <b>{totals.protein} g protein</b>
        <span style={{ color: MUTED }}> · {totals.carbs} g carbs · {totals.fat} g fat</span>
      </p>

      <button
        onClick={() =>
          onUse({ name: product.name, ...totals, note: `From the label: ${round1(amt)} ${u}.` })
        }
        disabled={amt <= 0}
        className="py-4 font-bold text-white"
        style={{ borderRadius: 18, background: BTNG, opacity: amt <= 0 ? 0.5 : 1 }}
      >
        Use these numbers
      </button>
      <button onClick={onBack} className="py-2 font-semibold" style={{ color: MUTED }}>
        Back
      </button>
    </div>
  );
}

export function LookupSpinner() {
  return (
    <p className="flex items-center gap-2 text-sm font-semibold" style={{ color: MUTED }}>
      <Loader2 size={18} className="animate-spin" /> Looking up the product...
    </p>
  );
}

export { OVER };
