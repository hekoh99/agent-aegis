PROMPT = """Fact-check the following content.

Criteria:
- Summarize the core claim
- Compare with known facts
- Assess source reliability

Provide results in this format:
1. Verdict: True / Mostly True / Uncertain / Mostly False / False
2. Explanation (2-3 lines in simple language)
3. Reference sources (include URLs if available)

Content to check:
{text}"""
