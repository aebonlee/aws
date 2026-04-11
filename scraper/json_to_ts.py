"""
JSON → TypeScript 변환기

사용법:
  python json_to_ts.py output/aif-c01.json
  python json_to_ts.py output/*.json
  python json_to_ts.py output/aif-c01.json --outdir ../src/data/practice
"""

import json
import sys
import glob
from pathlib import Path


def json_to_typescript(json_path: str, out_dir: str = None):
    """JSON 파일을 TypeScript 데이터 파일로 변환"""
    json_path = Path(json_path)

    with open(json_path, "r", encoding="utf-8") as f:
        questions = json.load(f)

    if not questions:
        print(f"빈 파일: {json_path}")
        return

    # 카테고리 ID 추출
    cat_id = questions[0].get("categoryId", json_path.stem)

    # 변수명 생성: aif-c01 → aifC01Questions
    parts = cat_id.split("-")
    if len(parts) == 2:
        var_name = parts[0] + parts[1][0].upper() + parts[1][1:] + "Questions"
        filename = parts[0] + parts[1][0].upper() + parts[1][1:] + ".ts"
    else:
        var_name = cat_id.replace("-", "") + "Questions"
        filename = cat_id.replace("-", "") + ".ts"

    # TypeScript 파일 생성
    lines = [
        "import type { PracticeQuestion } from '../quizData'",
        "",
        f"export const {var_name}: PracticeQuestion[] = [",
    ]

    for q in questions:
        # 문자열 이스케이프
        question = escape_ts(q.get("question", ""))
        explanation = escape_ts(q.get("explanation", ""))
        options = q.get("options", [])
        answer = q.get("answer", 0)

        if answer < 0:
            answer = 0

        opts_str = ", ".join(f"'{escape_ts(o)}'" for o in options)

        lines.append(
            f"  {{ categoryId: '{cat_id}', "
            f"question: '{question}', "
            f"options: [{opts_str}], "
            f"answer: {answer}, "
            f"explanation: '{explanation}' }},"
        )

    lines.append("]")
    lines.append("")

    # 출력 경로
    if out_dir:
        out_path = Path(out_dir) / filename
    else:
        out_path = json_path.parent / "ts" / filename

    out_path.parent.mkdir(parents=True, exist_ok=True)

    with open(out_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print(f"✓ {json_path.name} → {out_path} ({len(questions)}문제)")


def escape_ts(s: str) -> str:
    """TypeScript 문자열 이스케이프"""
    return (
        s.replace("\\", "\\\\")
        .replace("'", "\\'")
        .replace("\n", " ")
        .replace("\r", "")
        .replace("\t", " ")
    )


def main():
    if len(sys.argv) < 2:
        print("사용법: python json_to_ts.py <json파일> [--outdir <출력디렉토리>]")
        print("  python json_to_ts.py output/aif-c01.json")
        print("  python json_to_ts.py output/*.json --outdir ../src/data/practice")
        sys.exit(1)

    out_dir = None
    files = []

    i = 1
    while i < len(sys.argv):
        if sys.argv[i] == "--outdir" and i + 1 < len(sys.argv):
            out_dir = sys.argv[i + 1]
            i += 2
        else:
            # glob 패턴 처리
            matched = glob.glob(sys.argv[i])
            if matched:
                files.extend(matched)
            else:
                files.append(sys.argv[i])
            i += 1

    for f in files:
        if f.endswith(".json"):
            json_to_typescript(f, out_dir)


if __name__ == "__main__":
    main()
