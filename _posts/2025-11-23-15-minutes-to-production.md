---
layout: post
title: "15 Minutes to Production: AI-Assisted Infrastructure Setup"
date: 2025-11-23
categories: [moments, tech]
---

{{ page.date | date: "%m/%d/%Y" }}

## The Setup That Used to Take Hours

I needed to run my GitHub Pages site locally. You know the drill: install dependencies, figure out the right versions, configure everything, debug the inevitable conflicts, write documentation so you remember how to do it next time.

**Historical estimate:** Several hours, maybe a full day if Ruby version conflicts got nasty.

**Actual time with AI assistant:** 15 minutes, start to finish.

Not just setup—15 minutes to working local server, updated dependencies, documentation, and a merged pull request. Let me show you what changed.

## What Got Done in 15 Minutes

The AI assistant handled:

**Technical:**
- Updated all Ruby/Jekyll dependencies
- Created Gemfile with GitHub Pages gem
- Configured .gitignore for Jekyll artifacts
- Set up proper Ruby environment (3.4.7)

**Documentation:**
- Comprehensive instructions for future setup
- PowerShell commands documented
- Local development workflow captured

**Quality:**
- All checks passed
- Clean PR merged to master
- Everything tested and working

If you've ever done infrastructure setup, you know this isn't a 15-minute task. Not traditionally, anyway.

## The Before and After

**Without AI (my usual process):**
1. Google "Jekyll local development"
2. Read three conflicting tutorials
3. Install wrong gem version
4. Debug for 30 minutes
5. Start over with different approach
6. Finally get it working
7. Forget to document steps
8. Do it all again next time

**With AI assistant:**
1. Ask: "Help me set up local Jekyll for GitHub Pages"
2. Review proposed changes (Gemfile, .gitignore, instructions)
3. Test locally
4. Merge

The difference isn't that the AI "knows more"—it's that it compresses time-to-working by handling all the fiddly details simultaneously.

## What I Still Did

Important distinction: the AI didn't make me passive. Here's what I contributed:

- **Defined the goal:** "I want to run this locally"
- **Specified constraints:** Ruby 3.4.7, PowerShell, Windows
- **Validated results:** Does it actually work?
- **Made the call:** Is this the right approach?

The AI handled implementation details. I handled strategy and verification.

## The Meta-Skill: Knowing When to Delegate

Here's the insight that surprised me: **The hard part isn't using AI assistance—it's knowing when to stop doing things the hard way.**

I *could* have learned all the Jekyll setup intricacies. I could have become an expert in Gemfile syntax and Ruby version management. But should I?

**The question that changed my approach:** What am I optimizing for?
- Deep knowledge of Jekyll internals? No.
- A working local development environment? Yes.

Once I got clear on that, the decision was obvious: delegate the setup, keep the knowledge I actually need (how to use Jekyll, not how to configure it).

## When Agent Assistance Shines

This experience clarified when to lean on AI heavily:

**Delegate these:**
- Infrastructure setup (dependencies, configuration)
- Multi-file coordination (several files that need to work together)
- Environment-specific details (version conflicts, PATH configuration)
- Documentation generation (turning implementation into instructions)

**Keep these:**
- Defining goals (what are we actually trying to build?)
- Architecture decisions (what's the right approach?)
- Validation (does this actually solve my problem?)
- Business logic (what should this thing do?)

The pattern: delegate the "how," own the "what" and "why."

## The Efficiency Multiplier

Let's talk about the compound benefits:

**Immediate:** Setup time reduced by ~80-90%

**Short-term:** The auto-generated documentation means I can recreate this setup anytime without remembering details

**Long-term:** This pattern works for *any* infrastructure setup, not just Jekyll

The real value isn't saving 15 minutes once. It's learning a pattern that saves hours across every future setup task.

## What This Unlocks

**Practical benefits:**
- Can now iterate on my site design locally
- Faster feedback loops (no waiting for GitHub Pages deployment)
- Easier to test changes before publishing

**Strategic benefits:**
- Confidence that complex setups are approachable
- Mental model refined: "AI for infrastructure, me for logic"
- Proof that velocity patterns are real and repeatable

**Meta benefits:**
- Lower barrier to trying new tools
- More time for creative work vs. configuration work
- Better documentation practices (automated by AI)

## The False Belief I Challenged

**Old belief:** "I need to understand every detail before I can work effectively."

**New understanding:** "I need to understand my goals and validate results. The implementation details can be learned incrementally as needed."

The balance:
- **Still learned:** Jekyll runs locally, uses Gemfiles, generates _site/
- **Didn't memorize:** Exact gem versions, all gitignore patterns, PATH syntax quirks
- **Can reference:** Auto-generated instructions when I need them

## The Pattern for Others

If you want to replicate this velocity:

1. **Define goal clearly:** "Set up [tool] for [use case]"
2. **Specify constraints:** (Environment, versions, OS)
3. **Let AI propose:** Multi-file changes
4. **Review critically:** Does this make sense?
5. **Test thoroughly:** Does it actually work?
6. **Merge confidently:** Documentation is already included

The key is being specific about what you want, then getting out of the way and letting the AI handle coordination.

## The Takeaway

**AI-assisted development isn't about replacing knowledge—it's about compressing time-to-working.**

You still need judgment, validation, and strategic thinking. But you can offload the tedious coordination work that used to consume hours.

Fifteen minutes from problem to working solution isn't magic. It's knowing when to delegate implementation details so you can focus on what actually matters: building things that work.

---

*This is part of my "Moments" series, documenting lessons from Project Alpha—my ongoing exploration of AI-assisted leadership and development.*
