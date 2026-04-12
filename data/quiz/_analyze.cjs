const fs = require("fs");
const dir = "D:/dreamit-web/aws/data/quiz/";
const files = [
  "ml-development-2026-04-12.json",
  "ml-developmen.json",
  "sagemaker-2026-04-12.json",
  "genai-fundamentals-2026-04-12.json",
  "genai-fundamentals.json",
  "fm-utilization-2026-04-12.json",
  "fm-utilization-Q56-Q82-2026-04-12.json",
  "fm-evaluation-2026-04-12.json",
  "fm-evaluation-Q28-Q62-2026-04-12.json",
  "responsible-ai-2026-04-12.json",
  "responsible-ai-2026.json",
  "responsible-ai.json",
  "security-governance-2026-04-12.json",
  "quiz-2026-04-12.json",
  "quiz-2026-04-12_1.json",
  "quiz-2026-04-12-merged.json",
  "1-200.json",
  "200-400.json",
  "424.json"
];
for (var f of files) {
  try {
    var raw = fs.readFileSync(dir + f, "utf8");
    var d = JSON.parse(raw);
    var arr = Array.isArray(d) ? d : (d.questions || [d]);
    var first = arr[0] || {};
    var cats = {};
    arr.forEach(function(q) { var c = q.categoryId || "none"; cats[c] = (cats[c] || 0) + 1; });
    var nums = arr.map(function(q) {
      var text = String(q.question || q.questionText || "");
      var m = text.match(/Q(d+)/i);
      return m ? parseInt(m[1]) : null;
    }).filter(function(n) { return n !== null; });
    var minQ = nums.length ? Math.min.apply(null, nums) : "N/A";
    var maxQ = nums.length ? Math.max.apply(null, nums) : "N/A";
    var hasExpl = arr.some(function(q) { return "explanation" in q; });
    var hasExplEn = arr.some(function(q) { return "explanationEn" in q; });
    var hasQEn = arr.some(function(q) { return "questionEn" in q; });
    var hasOptEn = arr.some(function(q) { return "optionsEn" in q; });
    var emptyE = arr.filter(function(q) { return q.explanation === "" || !("explanation" in q); }).length;
    var filledE = arr.filter(function(q) { return q.explanation && q.explanation !== ""; }).length;
    console.log("=== " + f + " ===");
    console.log("  Count: " + arr.length);
    console.log("  Keys: " + Object.keys(first).join(", "));
    console.log("  Categories: " + JSON.stringify(cats));
    console.log("  Q range: Q" + minQ + " - Q" + maxQ);
    console.log("  explanation: " + hasExpl + " (" + filledE + " filled, " + emptyE + " empty)");
    console.log("  explanationEn: " + hasExplEn);
    console.log("  questionEn: " + hasQEn);
    console.log("  optionsEn: " + hasOptEn);
    console.log("");
  } catch(e) {
    console.log("=== " + f + " === ERROR: " + e.message);
    console.log("");
  }
}