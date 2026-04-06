PROMPT = """Analyze whether the following message is a phishing (smishing) attempt.

Criteria:
- Is the sender information suspicious?
- Does it create a sense of urgency?
- Does it request personal information?
- Does it contain suspicious links?

Provide results in this format:
1. Risk level: High / Medium / Low
2. Reasoning (2-3 lines in simple language)
3. Recommended action

Message:
{text}"""
