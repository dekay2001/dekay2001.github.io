---
layout: post
title: "The Playground as Staging Area: Why I Built My Lyrics Tool In-House"
date: 2026-01-19
categories: [moments, tech, product]
---

## The Playground as Staging Area: Why I Built My Lyrics Tool In-House

I almost created a new repository. Almost set up a new deployment pipeline. Almost made another small project to maintain. But then I realized: I already have the perfect place for this.

### The Problem

I wanted to practice memorizing rap lyrics. The challenge:
- Too fast to slow down effectively
- Can't control line-by-line timing
- Need it on multiple devices
- Existing tools don't fit the workflow

My first impulse: "I'll build an app for this." New repo, new deployment, new everything.

### The Pivot

The moment came when selecting a `.gitignore` template. What language? What platform?

**Wait.** I'm going to use this on my phone. That means web-based. And I already have a website. With a playground section. That's already deployed. That works on mobile.

**Key realization**: The playground isn't just decoration—it's a staging area for experimental features.

### What the Playground Provides

**Immediate deployment**  
No setup. No hosting decisions. Just build and it's live.

**Real infrastructure**  
Not a localhost prototype. Actually accessible from any device.

**Low-pressure space**  
It's a playground—expectations are different. I can experiment without it needing to be polished.

**Future flexibility**  
Features can graduate to the main site if they prove valuable. Or stay in the playground indefinitely.

**Idea incubator**  
Multiple experiments can coexist without cluttering the main experience.

### The Implementation

Built "Lyrical Learner" through four phases using TDD:

**Phase 1**: Core parsing and playback engine  
**Phase 2**: UI and karaoke-style display  
**Phase 3**: Navigation and keyboard shortcuts  
**Phase 4**: Loop mode and advanced features

**Result**: 207/207 tests passing. Fully functional. Already using it on my phone.

### What This Changes

Before: Every new idea meant a new repository, new deployment setup, new maintenance burden.

After: The playground becomes a first-class staging environment. Lower friction means more ideas can become reality.

**The pattern**:
1. Idea emerges
2. Prototype in playground
3. Use it, test it, iterate
4. Graduate to production (or leave in playground)
5. Minimal overhead throughout

### Why This Matters

It's not about the lyrics tool specifically. It's about recognizing that **infrastructure you already have can reshape what's possible**.

The playground was sitting there, mostly unused. Now it's an active development space. A place where small tools can exist without ceremony.

And that changes the calculus on what's worth building.

---

**Status**: Lyrical Learner is live in my [playground](/playground) and working great. Already using it to practice song memorization on mobile.

**Related moment**: [What Are AI Moments?](/blog/2026/01/17/what-are-ai-moments.html) - on documenting small discoveries like this
