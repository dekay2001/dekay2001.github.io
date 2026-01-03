---
layout: post
title: "When AI Instructions Go Wrong (And How to Fix Them)"
date: 2025-11-30
categories: [moments, tech]
---

{{ page.date | date: "%m/%d/%Y" }}

## When Good Guidelines Create Bad Code

I spent an hour crafting comprehensive coding standards for my AI assistant—clean code principles, documentation guidelines, naming conventions. The kind of stuff that makes experienced developers nod approvingly. I added these to my project's instructions file, feeling productive.

The very next interaction, the AI "helpfully" refactored 9 files of working code, broke my yoga sequence player, and added 520 lines of excessive documentation. I spent 30 minutes fixing what wasn't broken.

What went wrong? And what does this teach us about working with AI assistants?

## The Pattern: Instruction Overreach

Here's what happened:

**My intent:** "When writing *new* code or *reviewing* pull requests, follow these standards."

**AI's interpretation:** "Refactor *all existing code* to match these standards immediately."

The AI wasn't being malicious or buggy—it was being helpful. I'd given it standards without scope boundaries. It saw code that didn't match the new guidelines and thought: "I should fix that!"

### What Broke

The damage was specific:
- Function names changed (breaking existing references)
- Working code restructured (introducing new bugs)
- Every function got detailed JSDoc comments (noise, not clarity)
- The yoga sequence playback stopped working entirely

All of this from instructions that seemed perfectly reasonable when I wrote them.

## The Core Problem: Instructions Are Code

Here's the insight that changed how I think about AI instructions:

**Instructions execute in the AI's interpretation layer.** Bugs in instructions cause behavioral bugs, just like bugs in code cause program failures.

When I write: *"Always verify public interfaces are declared first"* without context, the AI hears: *"Refactor every file to put public interfaces first, starting now."*

### What Was Missing

Every guideline needs three things:
1. **When to apply:** "For new code and code reviews"
2. **When NOT to apply:** "Don't refactor existing working code"
3. **How to verify:** "Check that new functions follow this pattern"

I had #1 implied but not stated. I completely missed #2 and #3.

## The Fix: Scope Boundaries and Non-Goals

I revised my instructions to be explicit about scope:

**Before:**
```
During code reviews, always verify:
- Public interfaces declared first
- JSDoc for public APIs
```

**After:**
```
When writing NEW code or reviewing pull requests:
- Public interfaces declared first in new files
- JSDoc for public APIs only (not every function)

Do NOT:
- Refactor existing working code without request
- Add comments to every function
- Rename functions in working code
```

The difference? The second version tells the AI what *not* to do as explicitly as what to do.

## Testing Your Instructions

The experience taught me to treat instructions like code that needs testing:

**Pre-flight checklist before adding AI instructions:**
- [ ] Scope explicitly stated (when to apply)
- [ ] Non-goals listed (when NOT to apply)
- [ ] Test case ready (simple task to verify interpretation)
- [ ] Rollback plan (how to quickly undo if misinterpreted)

**Post-deployment monitoring:**
- First task should be simple and isolated
- Watch for unsolicited refactoring
- Be ready to rollback immediately
- Document any friction for future reference

## The Velocity Tax

Here's the kicker: In the week before this incident, I'd saved roughly 50 minutes using AI assistance for infrastructure setup, design iterations, and feature additions. One bad refactor consumed 30 minutes of fixes.

I'm still net positive, but the lesson is clear: **Speed without guardrails is expensive.**

Fast execution amplifies instruction quality. Clear instructions → 10-15 minute features. Ambiguous instructions → 30 minute fixes.

## What I Learned

Three key takeaways:

**1. Instructions need scope boundaries.** Don't just say what to do—explicitly state when to do it and when NOT to.

**2. Document non-goals.** The most valuable instructions tell the AI what to avoid, not just what to pursue.

**3. Test incrementally.** Don't add comprehensive guidelines all at once. Add one or two, test with simple tasks, then expand based on actual behavior.

## The Bigger Pattern

This connects to something I'm exploring in Project Alpha, my ongoing experiment with AI collaboration: **AI assistants amplify both clarity and ambiguity.**

Clear instructions → exceptional velocity
Ambiguous instructions → expensive detours

The goal isn't to eliminate ambiguity—that's impossible. The goal is to recognize when you've introduced it and course-correct quickly.

**Bottom line:** When your AI assistant misbehaves, check your instructions first. The bug might be in your guidance, not in the AI.

---

*This post is part of my "Moments" series, documenting lessons learned while building Project Alpha—an exploration of AI-assisted leadership and development. You can read more about [the project on my blog](/).*
