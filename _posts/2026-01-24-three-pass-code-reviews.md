---
layout: post
title: "The Three-Pass Pattern: What AI Code Reviews Miss"
date: 2026-01-24
categories: [moments, tech, philosophy]
---

## The Three-Pass Pattern: What AI Code Reviews Miss

I discovered I'd been skipping a step in my AI collaboration workflow. And it raises a question I can't yet answer: do engineering principles still matter when code is disposable?

### The Missing Middle

Working with AI on a mobile navigation menu, my review process was:

1. **Functional pass**: Does it work? Tests passing?
2. **Readability pass**: Is it understandable?

Seemed complete. But something felt off. The code worked. It read well. But underneath...

- Mixed responsibilities (state + events + DOM in one blob)
- Tight coupling (couldn't test without real DOM)  
- Magic strings everywhere
- Not extensible

I was checking *readability* but not *architecture*. Reading clean code built on messy structure.

### The Three-Pass Pattern

The actual workflow should be:

**Pass 1: Functional**  
Get it working. Tests passing. Requirements met.

**Pass 2: Architectural (SOLID)**  
- Single Responsibility: Each class does one thing
- Open/Closed: Extensible without modification
- Liskov Substitution: Interfaces behave predictably
- Interface Segregation: No fat interfaces  
- Dependency Inversion: Depend on abstractions

**Pass 3: Readability**  
Optimize for comprehension. Documentation. Naming. Extract complex logic.

**Key insight**: You can't optimize readability on bad architecture. The SOLID pass must come before the readability pass.

Each catches different problems:
- Pass 1: Logic errors, missing features
- Pass 2: Coupling, responsibility mixing, extensibility  
- Pass 3: Comprehension barriers, unclear intent

### Why AI Needs This

AI's current strengths:
- Implements features quickly
- Produces working code
- Can apply patterns when directed

AI's blind spots:
- Doesn't inherently prioritize architecture
- May produce monolithic solutions
- Won't refactor for SOLID unless explicitly asked
- Can create readable code that's structurally problematic

The three-pass pattern leverages AI speed while applying human architectural oversight.

### The Existential Question

But here's what haunts me:

**If AI is doing all the coding, do these principles still matter?**

**Arguments for "Principles Don't Matter"**:
- AI can regenerate code on demand → disposability over maintainability
- Future AI might handle refactoring better than humans
- Clean architecture was for human maintenance—if AI maintains it, who cares?
- Tool velocity is so high that today's "clean code" might be irrelevant next year

**Arguments for "Principles Still Matter"**:
- My gut says they're valuable (but no proof)
- Better tests emerge from better architecture
- AI performs better with well-structured context
- Regeneration cost isn't zero
- Principles might transfer even as tools evolve

**What I have**: Intuition, gut feeling, anecdotal experience  
**What I lack**: Proof, data, long-term validation

### The Pragmatic Position

For now, I'm continuing the three-pass pattern:

1. Principles have worked for decades
2. Adding ~30 minutes per feature is low cost  
3. It's a reversible decision
4. Better safe than sorry
5. AI learns better patterns when I model them

But I'm staying open to being wrong. Tracking pain points. Watching for evidence that principles are obsolete in the AI era.

### New Justification Hypothesis

Maybe principles aren't *for the code*. Maybe they're **cognitive scaffolding for effective AI prompting**.

You architect in your head, then guide AI to implement that architecture. The discipline isn't for future maintainers—it's for clarifying your own thinking before delegating implementation.

Traditional reasons don't fit anymore:
- "For maintainability" → AI can regenerate  
- "For team communication" → Solo + AI
- "For future developers" → Will they even read code or just prompt?

The new reason might be: **For clear thinking about what you want built.**

### Time Investment

Hamburger menu example:
- Pass 1 (Functional): ~45 minutes
- Pass 2 (SOLID): ~30 minutes (full rewrite to classes)
- Pass 3 (Readability): ~15 minutes  
- **Total**: ~90 minutes

Skip passes 2 & 3 and save 45 minutes. But is the future maintenance cost greater than 45 minutes? I don't know yet.

### The Real Discovery

The three-pass pattern isn't just a workflow—it's a thinking framework:

1. **Does it work?** (Functional thinking)
2. **Is it well-structured?** (Architectural thinking)  
3. **Is it understandable?** (Communication thinking)

Each asks a fundamentally different question. Collapsing them into one review risks missing entire dimensions of quality.

But I'm uncertain. The old justifications for engineering principles don't apply in a world of disposable, regenerable code. The new justifications aren't clear yet.

**I believe structure matters. I just can't fully articulate why anymore.**

Maybe time will tell. Maybe the next generation of AI will make this whole discussion obsolete. Maybe principles are timeless.

For now, I'm doing the three passes. Watching the evidence. Staying skeptical.

---

*This moment explores the tension between engineering discipline and AI-accelerated disposability. For full technical details, philosophical exploration, and open questions, see the [moment document](https://github.com/dekay2001/ai-prompts-library/blob/master/project-alpha/moments/2026-01-24-code-quality-principles-in-ai-collaboration.md) in the ai-prompts-library repository.*
