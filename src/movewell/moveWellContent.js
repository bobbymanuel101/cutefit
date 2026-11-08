// =====================================================================================
// CuteFit "Move well" content. FOR PHYSIOTHERAPIST REVIEW BEFORE LAUNCH.
//
// Rules the app follows:
//  - An exercise is only shown to users when "approved: true".
//  - Until then it shows only in preview mode, clearly marked as a draft.
//  - All wording here was drafted from published guidance and needs a clinician's review.
//  - Nothing here is a diagnosis. Keep health claims careful ("support", not "treat").
// To rename the section, change MW_NAME.
// =====================================================================================

export const MW_NAME = "Move well";
export const MW_TAGLINE = "Gentle exercises for your back, joints, pelvic floor, periods and MS";

export const MW_TRACKS = [
  { id: "back", title: "Back and spine", blurb: "Gentle movement for back pain and stiffness" },
  { id: "legs", title: "Hips, knees and legs", blurb: "Mobility and strength for sore or stiff joints" },
  { id: "upper", title: "Shoulders and neck", blurb: "Easing stiffness and building control" },
  { id: "hands", title: "Hands and wrists", blurb: "Mobility and grip for stiff or sore hands" },
  { id: "strengthen", title: "Pelvic floor: strengthen", blurb: "Training for leaks and support" },
  { id: "relax", title: "Pelvic floor: relax and lengthen", blurb: "Releasing a tight pelvic floor" },
  { id: "periods", title: "Periods and PCOS", blurb: "Activity for period pain and PCOS" },
  { id: "ms", title: "Multiple sclerosis", blurb: "Strength, balance and energy-aware movement" },
];

export const MW_GROUPS = [
  { title: "Back and joints", tracks: ["back", "legs", "upper", "hands"] },
  { title: "Pelvic floor", tracks: ["strengthen", "relax"] },
  { title: "Periods and PCOS", tracks: ["periods"] },
  { title: "Neurological", tracks: ["ms"] },
];

// "What would you like help with?"
export const MW_AREAS = [
  { id: "back", text: "Back pain or stiffness" },
  { id: "legs", text: "Hips, knees or legs" },
  { id: "upper", text: "Shoulders or neck" },
  { id: "hands", text: "Hands or wrists" },
  { id: "pelvic", text: "Pelvic floor, bladder or pelvic pain" },
  { id: "periods", text: "Period pain or PCOS" },
  { id: "ms", text: "Multiple sclerosis" },
];

// Safety check, part 1. Any tick = "please get medical help now".
export const MW_URGENT = [
  "Sudden or severe pain, or pain after a fall or injury where you can't use or put weight on a limb",
  "Fever together with back, joint or pelvic pain, or with urinary or bowel symptoms",
  "New numbness around your groin, genitals or inner thighs",
  "New loss of control of your bladder or bowel, or you can't pass urine",
  "Pain, numbness or weakness in both legs",
  "New weakness, numbness, vision loss or balance problems that came on suddenly",
  "Chest pain or trouble breathing",
  "Heavy bleeding, or blood in your urine or stool that your period doesn't explain",
  "You're pregnant and have sharp or worsening pain, or any bleeding",
];

// Safety check, part 2. Any tick = "please see a doctor before you start".
export const MW_SOON = [
  "Back pain together with unexplained weight loss",
  "Pain that wakes you at night or doesn't ease at all with rest or a change of position",
  "A joint that is hot, red or swollen",
  "Numbness, tingling or weakness in an arm or leg that is getting worse",
  "A new lump or swelling",
];

// Extra questions, shown only for the areas the person picked.
// group: "tight" | "weak" (pelvic floor), "cycle" (periods), "ms", "back"
export const MW_SYMPTOMS = [
  { id: "pain-sex", group: "tight", text: "Pain during sex" },
  { id: "pain-tampon", group: "tight", text: "Pain with tampons or pelvic exams" },
  { id: "tension", group: "tight", text: "A constant feeling of tightness or clenching in your pelvis, hips or lower back" },
  { id: "empty-pain", group: "tight", text: "Pain or difficulty emptying your bladder or bowels (and a doctor has ruled out an infection)" },
  { id: "kegel-worse", group: "tight", text: "Squeezing exercises such as Kegels have made things feel worse" },
  { id: "leak-effort", group: "weak", text: "Leaking when you cough, sneeze, laugh, jump or lift" },
  { id: "leak-urge", group: "weak", text: "A sudden, strong urge to pee, and sometimes not making it in time" },
  { id: "heaviness", group: "weak", text: "A heavy or dragging feeling in your pelvis, especially later in the day" },
  { id: "bulge", group: "weak", text: "You can feel or see a bulge in the vagina" },
  { id: "bowel-leak", group: "weak", text: "Leaking gas or stool" },
  { id: "cramps", group: "cycle", text: "Painful period cramps" },
  { id: "irregular", group: "cycle", text: "Irregular periods" },
  { id: "pcos", group: "cycle", text: "I've been diagnosed with PCOS" },
  { id: "endo", group: "cycle", text: "I've been diagnosed with endometriosis" },
  { id: "ms-heat", group: "ms", text: "Heat makes my symptoms feel worse" },
  { id: "ms-fatigue", group: "ms", text: "I get very tired after being active" },
  { id: "ms-balance", group: "ms", text: "I have balance problems, or I've fallen recently" },
  { id: "ms-aid", group: "ms", text: "I use a walking aid or a wheelchair" },
  { id: "back-leg", group: "back", text: "Pain, tingling or numbness travels down one leg" },
];

export const MW_SYMPTOM_GROUPS = [
  { group: "tight", label: "Pelvic floor: tightness or pain", area: "pelvic" },
  { group: "weak", label: "Pelvic floor: leaks or heaviness", area: "pelvic" },
  { group: "cycle", label: "Periods, PCOS and endometriosis", area: "periods" },
  { group: "ms", label: "Multiple sclerosis", area: "ms" },
  { group: "back", label: "Back", area: "back" },
];

// Shown on every exercise page, in addition to each exercise's own "stopIf" list.
export const MW_STOP = [
  "Sharp or increasing pain",
  "New numbness, tingling or weakness",
  "A joint that becomes hot, red or more swollen",
  "Leaking, heaviness or pain that is worse afterwards",
  "Dizziness or feeling faint",
  "New bleeding",
];

// A short safety message at the top of each track.
export const MW_TRACK_SAFETY = {
  back: "For most back pain, staying gently active helps more than resting in bed. Move within comfortable limits and build up slowly. Some soreness is normal. The warning signs under Get help need a doctor.",
  legs: "Exercise is a recommended first step for sore knees and hips. Some discomfort while you move is common, but stop if the pain is sharp or the joint swells.",
  upper: "Move gently within comfort. Stop if the pain is sharp, or if you feel tingling or weakness in your arm or hand.",
  hands: "Gentle movement helps keep joints mobile and builds grip. Work within comfort, and stop if joints become hot, red or more swollen.",
  strengthen: "Technique matters. Many women find it hard to squeeze the right muscles at first, so a pelvic health physiotherapist can check yours.",
  relax: "These exercises aim to release a tight pelvic floor. Squeezing exercises such as Kegels can make a tight pelvic floor worse.",
  periods: "Regular activity may ease period pain and helps with PCOS. For PCOS, adults are advised 150 to 300 minutes of moderate activity a week plus strength work on two days.",
  ms: "Exercise is generally considered safe and helpful in MS. Fatigue and heat can make symptoms feel worse for a while, so keep cool, start small, rest when you need to and build up slowly. If balance is a problem, hold on to something steady or exercise seated.",
};

// Wording for the result screen.
export const MW_RESULT = {
  tracks: {
    back: { title: "Back and spine: keep moving gently", body: "For most back pain, staying gently active helps more than resting. We'll start with gentle movement within comfortable limits." },
    legs: { title: "Hips, knees and legs: gentle strengthening", body: "Exercise is a recommended first step for sore knees and hips. We'll start gently and build up." },
    upper: { title: "Shoulders and neck: ease and control", body: "We'll start with gentle movement to ease stiffness and build control." },
    hands: { title: "Hands and wrists: gentle movement", body: "Exercises that keep joints moving and build grip are recommended for sore hands. We'll start gently." },
    strengthen: { title: "Pelvic floor: strengthening", body: "Leaks and a heavy or dragging feeling often improve with regular pelvic floor training. Technique matters a lot, so a check by a pelvic health physiotherapist is worth having." },
    relax: { title: "Pelvic floor: relaxing and lengthening", body: "Some of what you described can go with a pelvic floor that is too tight. In that case squeezing exercises such as Kegels can make symptoms worse, so we start with relaxing and stretching." },
    periods: { title: "Periods and PCOS: regular gentle activity", body: "Regular activity can help with period pain and with PCOS. You can track your weekly activity minutes in the Activity tab." },
    ms: { title: "Multiple sclerosis: strength, balance and energy", body: "Exercise is considered safe and helpful in MS, with plans that work around fatigue and heat. We'll start small and build up." },
  },
  notes: {
    physio: "A physiotherapist can check your movement and give you a personal plan.",
    mixed: "You described both tightness and leaks. Relaxing first is the safer starting point for your pelvic floor. A pelvic health physiotherapist can tell you whether and when to add strengthening.",
    prolapse: "A bulge or a heavy, dragging feeling should be looked at by a doctor or pelvic health physiotherapist. Supervised training has the best evidence for prolapse.",
    pelvicBoth: "You didn't tick any pelvic floor symptoms, so both pelvic floor tracks are shown. A pelvic health physiotherapist can tell you which suits you.",
    pcos: "PCOS is mainly managed with regular overall activity. Pelvic floor exercises are not a treatment for PCOS itself.",
    "ms-heat": "Heat can make MS symptoms feel worse for a while during exercise. Choose a cool room, use a fan, wear light clothes and drink cool water.",
    "ms-fatigue": "Because you get very tired after activity, start with short sessions, even 10 minutes, rest in between and build up slowly.",
    "ms-balance": "Because balance is a concern, hold on to something steady or exercise seated, and ask a physiotherapist to check your setup.",
    "ms-aid": "Many exercises can be done seated or with support. A physiotherapist can adapt them for you.",
    sciatica: "Pain that travels down a leg is worth mentioning to a doctor or physiotherapist if it doesn't ease within a week or two.",
  },
};

// Exercises. Every body field is intentionally EMPTY. The physiotherapist writes them.
//   summary: one or two sentences.   steps: ["...", "..."]   cues: tips and common mistakes
//   stopIf: extra stop signs for this exercise   level: "Beginner" | "Intermediate"
//   timer: null, or { phases: [{ label, secs }], reps, maxSecs }   (maxSecs defaults to 10)
//   draftTimer: only used in preview mode, so the timer can be seen working
const MW_BREATHE = { phases: [{ label: "Breathe in", secs: 4 }, { label: "Breathe out", secs: 6 }], reps: 8 };
const MW_HOLD = { phases: [{ label: "Hold", secs: 20 }, { label: "Rest", secs: 10 }], reps: 3, maxSecs: 30 };
// TRIAL TEXT: general example instructions written for testing the app, in the style of
// common NHS exercise sheets. NOT reviewed by a physiotherapist. The physiotherapist should
// replace or correct each entry, then set approved: true on the exercise.
const T = (level, summary, steps, cues = [], stopIf = []) => ({ level, summary, steps, cues, stopIf });
const MW_TRIAL_TEXT = {
  "bk-walk": T("Beginner", "Short, easy walks keep your back moving and are one of the best things for most back pain.", ["Walk at an easy pace on flat ground for 5 to 10 minutes.", "Stand tall and let your arms swing naturally.", "Add a few minutes every couple of days if it feels fine."], ["A little discomfort is normal. It should ease, not build up.", "Several short walks are fine instead of one long one."], ["Pain spreads down a leg or gets worse as you walk"]),
  "bk-tilt": T("Beginner", "A small, gentle movement that gets your lower back moving.", ["Lie on your back with knees bent and feet flat.", "Breathe out and gently flatten your lower back into the floor by tightening your tummy.", "Breathe in and let your back relax back to its natural curve.", "Repeat slowly, following the timer."], ["Keep the movement small and smooth.", "Keep your bottom on the floor."]),
  "bk-knee": T("Beginner", "A gentle stretch for your lower back and bottom.", ["Lie on your back with knees bent.", "Hold behind one knee and gently bring it towards your chest until you feel a light stretch.", "Hold, then lower it slowly. Swap legs.", "Follow the timer for holds and rests."], ["Keep your other foot on the floor.", "You should feel a stretch, not pain."]),
  "lg-sit": T("Beginner", "Builds strength in your thighs and hips for everyday moves like getting out of a chair.", ["Sit near the front of a firm chair, feet hip-width apart.", "Lean forward slightly and stand up, using your hands on your thighs if needed.", "Slowly sit back down with control.", "Do 5 to 10, rest, and repeat once if it feels fine."], ["Keep your knees in line with your toes.", "Use a higher chair to make it easier."]),
  "lg-raise": T("Beginner", "Strengthens the front of the thigh without bending a sore knee.", ["Lie on your back with one knee bent and the other leg straight.", "Tighten the thigh of the straight leg and lift it to the height of the bent knee.", "Hold for 2 seconds and lower slowly.", "Do 5 to 10 on each leg."], ["Keep your lower back relaxed on the floor.", "Keep the lifted leg straight."]),
  "lg-heel": T("Beginner", "Gently helps your knee and hip bend and straighten.", ["Lie on your back or sit with legs straight out.", "Slowly slide one heel towards your bottom, bending your knee as far as is comfortable.", "Slide it back out slowly.", "Do 10 on each leg."], ["Move only as far as is comfortable."]),
  "up-roll": T("Beginner", "Loosens stiff shoulders and the top of your back.", ["Sit or stand tall with your arms relaxed.", "Slowly roll your shoulders up, back and down in a circle.", "Do 10, then 10 the other way."], ["Make the circles slow and smooth.", "Breathe normally."]),
  "up-neck": T("Beginner", "A gentle movement to ease a stiff neck.", ["Sit tall with your shoulders relaxed.", "Slowly turn your head to look over one shoulder as far as is comfortable.", "Come back to the middle and turn to the other side.", "Move with your breathing, following the timer."], ["Keep your chin level.", "Never force the movement."], ["You feel dizzy, sick, or have tingling in your arms"]),
  "up-wall": T("Intermediate", "Builds control around your shoulder blades.", ["Stand with your back and forearms against a wall, elbows bent.", "Slowly slide your arms up the wall as far as is comfortable.", "Slide them back down.", "Do 5 to 10."], ["Keep your lower back close to the wall.", "Go only as high as you can without pain."]),
  "hd-fist": T("Beginner", "Keeps your finger joints moving.", ["Hold your hand up with fingers straight.", "Slowly bend your fingers into a loose fist, thumb on the outside.", "Open your hand fully again.", "Do 10 with each hand."], ["Warm your hands in warm water first if they're stiff."]),
  "hd-thumb": T("Beginner", "A gentle stretch for a stiff thumb.", ["Rest your hand on a table, palm down.", "Gently move your thumb away from your fingers as far as is comfortable.", "Hold, then relax, following the timer."], ["A gentle stretch only, never pain."]),
  "hd-grip": T("Intermediate", "Builds grip strength for everyday tasks.", ["Hold a soft ball or rolled-up sock in your hand.", "Squeeze gently for 3 to 5 seconds, then relax.", "Do 10 with each hand."], ["Start with a very soft ball."], ["Your joints become more swollen or painful afterwards"]),
  "ps-slow": T("Beginner", "Slow squeezes build strength and endurance in your pelvic floor muscles.", ["Sit, stand or lie comfortably.", "Squeeze and lift the muscles you'd use to stop passing wind and to stop the flow of urine.", "Hold the squeeze, then fully let go and rest, following the timer.", "Aim to do this 3 times a day."], ["Keep breathing. Don't hold your breath.", "Don't squeeze your bottom, thighs or tummy.", "Letting go fully is as important as squeezing.", "Don't practise by stopping your wee on the toilet."], ["You feel pain in your pelvis or during sex afterwards"]),
  "ps-quick": T("Beginner", "Quick squeezes help your muscles react fast, for example when you cough or sneeze.", ["Get comfortable.", "Squeeze and lift your pelvic floor quickly, then let go fully.", "Follow the timer for squeeze and relax.", "Do these after your slow squeezes."], ["Fully relax between each squeeze.", "Keep breathing normally."]),
  "rl-breath": T("Beginner", "Deep belly breathing helps a tight pelvic floor relax and lengthen.", ["Lie on your back with knees bent, or sit comfortably.", "Put one hand on your belly.", "Breathe in slowly through your nose and let your belly rise. Feel your pelvic floor gently drop and soften.", "Breathe out slowly and let everything relax. Don't squeeze."], ["This is about letting go, not tightening.", "If your mind wanders, bring it back to your belly."]),
  "rl-child": T("Beginner", "A resting stretch that can help your lower back and pelvic floor relax.", ["Kneel on the floor with knees apart and big toes together.", "Sit back towards your heels and lower your chest towards the floor, arms forward or by your sides.", "Rest your head on the floor or a cushion and breathe slowly, following the timer."], ["Put a cushion between your bottom and heels if you can't reach."], ["You feel pain in your knees"]),
  "rl-baby": T("Beginner", "A gentle stretch that opens your hips and helps your pelvic floor relax.", ["Lie on your back and bring your knees towards your chest.", "Hold the outsides of your feet or your shins, knees wide apart.", "Gently draw your knees down towards your armpits and breathe slowly, following the timer."], ["Keep your head and shoulders relaxed on the floor.", "Rock gently side to side if that feels good."]),
  "pd-walk": T("Beginner", "A brisk walk is a simple way to get regular activity, which can ease period pain and helps with PCOS.", ["Walk at a pace where you can talk but not sing.", "Start with 10 to 15 minutes.", "Build up towards 30 minutes on most days."], ["Count it in the Activity tab."]),
  "pd-strength": T("Intermediate", "Simple strength moves twice a week support your overall health, including with PCOS.", ["Do 8 to 10 sit-to-stands from a chair.", "Do 8 to 10 wall push-ups.", "Do 8 to 10 calf raises holding a steady surface.", "Rest, then repeat the round once or twice."], ["Move slowly and with control.", "Gentler versions are fine on days with period pain."]),
  "pd-stretch": T("Beginner", "Gentle stretches with slow breathing can help ease period cramps.", ["Lie on your back with knees bent.", "Let both knees fall slowly to one side, then the other.", "Then rest in child's pose or with your knees hugged to your chest.", "Breathe slowly throughout, following the timer."], ["A warm hot-water bottle on your tummy can help too."], ["The pain is much worse than your usual periods"]),
  "ms-march": T("Beginner", "Gets your legs working while you sit safely.", ["Sit tall near the front of a sturdy chair, feet flat.", "Lift one knee a little, put it down, then the other, like marching.", "March for 30 seconds, then rest. Repeat 3 times."], ["Hold the sides of the chair for support.", "Rest as much as you need."]),
  "ms-sit": T("Beginner", "Builds leg strength for standing and walking, with support close by.", ["Sit on a firm chair with a steady surface such as a kitchen counter in front of you.", "Lean forward and stand up, holding the surface if needed.", "Sit back down slowly.", "Do 3 to 5, rest, and repeat if you feel able."], ["Stop before you get too tired.", "Use a higher chair to make it easier."]),
  "ms-balance": T("Intermediate", "Practising balance with support can make you steadier.", ["Stand facing a kitchen counter, holding it with both hands.", "Stand with feet together for 10 to 20 seconds.", "If that feels steady, try lifting one hand a little off the counter.", "Rest, then repeat 3 times."], ["Always have a steady surface within reach.", "Have someone nearby the first few times."], ["You feel unsteady or your vision changes"]),
  "ms-arms": T("Beginner", "Keeps your shoulders and arms moving while seated.", ["Sit tall in a chair.", "Slowly raise both arms forward and up as far as is comfortable.", "Lower them slowly.", "Do 5 to 10, then rest."], ["Do one arm at a time if both feel too much."]),
};
const mwEx = (id, track, title, draftTimer = null) => ({ id, track, title, approved: false, summary: "", steps: [], cues: [], stopIf: [], level: "", timer: null, draftTimer, reviewedBy: "", reviewedOn: "", ...MW_TRIAL_TEXT[id] });

export const MW_EXERCISES = [
  mwEx("bk-walk", "back", "Gentle walking"),
  mwEx("bk-tilt", "back", "Pelvic tilts", MW_BREATHE),
  mwEx("bk-knee", "back", "Knee-to-chest stretch", MW_HOLD),
  mwEx("lg-sit", "legs", "Sit-to-stand"),
  mwEx("lg-raise", "legs", "Straight leg raise"),
  mwEx("lg-heel", "legs", "Heel slides"),
  mwEx("up-roll", "upper", "Shoulder rolls"),
  mwEx("up-neck", "upper", "Gentle neck turns", MW_BREATHE),
  mwEx("up-wall", "upper", "Wall slides"),
  mwEx("hd-fist", "hands", "Finger bends and gentle fist"),
  mwEx("hd-thumb", "hands", "Thumb stretches", MW_HOLD),
  mwEx("hd-grip", "hands", "Squeezing a soft ball"),
  mwEx("ps-slow", "strengthen", "Slow pelvic floor squeezes", { phases: [{ label: "Squeeze", secs: 5 }, { label: "Relax", secs: 5 }], reps: 5 }),
  mwEx("ps-quick", "strengthen", "Quick pelvic floor squeezes", { phases: [{ label: "Squeeze", secs: 1 }, { label: "Relax", secs: 3 }], reps: 10 }),
  mwEx("rl-breath", "relax", "Belly breathing with pelvic floor release", { phases: [{ label: "Breathe in", secs: 4 }, { label: "Breathe out", secs: 6 }], reps: 10 }),
  mwEx("rl-child", "relax", "Child's pose", MW_BREATHE),
  mwEx("rl-baby", "relax", "Happy baby", MW_BREATHE),
  mwEx("pd-walk", "periods", "Brisk walk"),
  mwEx("pd-strength", "periods", "Gentle full-body strength"),
  mwEx("pd-stretch", "periods", "Relaxing stretches for period pain", MW_BREATHE),
  mwEx("ms-march", "ms", "Seated marching"),
  mwEx("ms-sit", "ms", "Sit-to-stand with support"),
  mwEx("ms-balance", "ms", "Balance holding a steady surface"),
  mwEx("ms-arms", "ms", "Seated arm raises"),
];
