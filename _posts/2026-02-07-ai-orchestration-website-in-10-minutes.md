---
layout: post
title: "AI Orchestration: Building a Jekyll Site in 10 Minutes"
date: 2026-02-07
categories: [moments, tech, ai]
---

## AI Orchestration: Building a Jekyll Site in 10 Minutes

I wanted to build a website for my local run group. Ten minutes later, I had a pull request with a complete Jekyll site, screenshots, and deployment instructions. But the story isn't just about speed—it's about orchestrating multiple AI models for their strengths.

### Phase 1: Strategic Research

**Tool**: Windows M365 Copilot (Deep Research mode)  
**Question**: Should I fork my existing `dekay2001.github.io` or create a new repository?

The research mode helped me think through trade-offs:
- Fork: Faster start, but brings existing history and coupling
- New repo: Clean slate, but more setup

**Decision**: New repository. The clean separation was worth it.

### Phase 2: Prompt Engineering Under Constraint

**Challenge**: GitHub's repository setup has a 500-character limit for the AI generation prompt.

First attempt from M365 Copilot: ~800 characters. Too long. Too detailed.

**Solution**: Manually trimmed to under 500 characters. Forced clarity. Specified:
- Jekyll framework
- Running club context
- Pages needed (events, membership, sponsors, pub runs)
- Responsive design

**Learning**: The constraint actually improved the prompt. Less verbose = more focused output.

### Phase 3: Instant Scaffolding

**Time**: ~10 minutes from prompt submission to PR  
**Result**: 
- Complete Jekyll site structure
- All specified pages implemented
- Responsive CSS
- Navigation and footer components
- Screenshot preview in the PR

What would normally take 2-4 hours to hand-scaffold: generated in minutes.

### Phase 4: Sanitization with Opus

**Problem**: The generated site included real-world details:
- Business names (SIX03, Dover-specific locations)
- Specific pricing ($40/$60/$25 membership fees)
- Real pub names and discounts
- Contact details and phone numbers

**Tool**: Claude Opus 4.6  
**Approach**: Comprehensive audit across 8 files
- Identified all real-world references
- Replaced with generic placeholders (`{{ site.title }}`, `$XX/year`, `TODO:`)
- Maintained functionality while removing specifics

**Result**: Clean template ready for customization, not tied to any real business.

### Phase 5: Code Review

**Tool**: GitHub Copilot (cloud review)  
**Outcome**: 
- Structural suggestions applied
- Accessibility checks passed
- Minor naming improvements
- No architectural issues

Review → Apply → Merge (same day).

### Phase 6: Local Iteration

```bash
bundle install              # Install dependencies
bundle exec jekyll serve    # Live preview
# http://localhost:4000
```

Auto-regeneration enabled. File changes rebuild instantly. Ready for customization.

### The Pattern: AI Model Selection

Different models for different phases:

**M365 Copilot**: Strategic research and decision support  
**GitHub AI**: Rapid scaffolding and code generation  
**Opus 4.6**: Heavy refactoring and sanitization  
**GitHub Copilot**: Code review and iteration

Each tool played to its strengths. The result wasn't "AI did everything"—it was "AI accelerated the work I chose to delegate."

### Key Insights

**1. Constraints drive clarity**  
The 500-character limit forced better prompting. Verbose ≠ better.

**2. Template generation is a skill**  
Not just "copy this code"—understanding how to generate production-ready starting points that you then own and customize.

**3. Verification matters**  
The generated code was solid, but domain-specific details needed human judgment. AI can't know what's real vs. placeholder without context.

**4. Ownership through review**  
Spending 30 minutes reviewing locally, understanding structure, planning next steps—that's where you take ownership.

**5. Orchestration > automation**  
This wasn't about one tool doing everything. It was about using the right tool for each phase.

### What's Next

- Add custom styling (currently using Jekyll defaults)
- Configure GitHub Pages deployment
- Slim down pages based on actual needs
- Iterate on real content

### The Bigger Picture

This workflow demonstrates **end-to-end AI collaboration**:
- Research → Strategic decisions
- Generation → Rapid scaffolding
- Refinement → Heavy refactoring
- Review → Quality verification
- Deployment → Ready to ship

**Time from idea to mergeable PR**: 40 minutes (10 min generation + 30 min review/cleanup)  
**Traditional time estimate**: 4-6 hours

The speedup is real. But more importantly: the workflow shows how AI changes what's worth starting. Lower friction means more ideas cross the threshold from "maybe someday" to "let's do this now."

---

**Status**: Site is merge-ready and waiting for custom styling and final deployment configuration.

**Related moments**: 
- [Playground as Staging Area](/blog/2026/01/19/playground-as-staging-area.html) - similar infrastructure reuse pattern
- [Three-Pass Code Reviews](/blog/2026/01/24/three-pass-code-reviews.html) - verification approach applied here
