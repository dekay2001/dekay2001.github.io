---
layout: post
title: "Session Orchestration: From Brain Dump to Shipped PRs"
date: 2026-04-20
categories: [moments, ai, workflow]
---

## Session Orchestration: From Brain Dump to Shipped PRs

End of a work session. Three repositories active. Book chapters in progress, workflow tooling half-built, a website with uncommitted changes. The usual question: *what do I need to commit before I close the laptop?*

This time, I didn't answer it myself. An AI agent did.

## The Problem Nobody Optimizes

Over the past several months I've been building an AI-assisted development workflow. The execution layer got fast — agents writing code, generating PRs, reviewing drafts. The documentation layer got structured — a three-tier system of versions, moments, and chapters capturing everything I learn. The shipping layer got automated — a create-pr skill that stages, commits, pushes, and opens a pull request with a generated description.

But the *session itself* — what to work on, in what order, how to wrap up — was still ad hoc. Every session started with "where was I?" and ended with a scramble to figure out what was committed, what needed a branch, and what was tangled together.

I'd optimized everything except the container that everything happened inside.

## The Brain Dump Protocol

The fix was embarrassingly simple: dump everything on your mind at the start of a session and let an agent sort it.

Not a structured task list. Not a prioritized backlog. A raw, unfiltered brain dump — what you want to work on, what's nagging you, what deadlines are looming, what random ideas surfaced since last time.

The orchestrate agent classifies each item by how much of *you* it needs:

- 🔴 **High engagement** — needs your focused attention, judgment, taste. This is the one thing you should actually be doing.
- 🟡 **Medium engagement** — needs a quick decision or review, then can proceed.
- 🟢 **Low engagement** — can run autonomously. Hand it off and forget about it.

The output is a session plan: one focus task for you, background threads for agents, and a clear picture of what "done" looks like for the session.

## The Proof Was the Session Itself

The first real test happened during the session where I built the orchestrator. I had one branch with a single commit containing two unrelated bodies of work — workflow tooling and next-chapter preparation for a book I'm writing. Classic end-of-day tangle.

Instead of shipping it as one messy PR or deferring the cleanup, the agent:

1. Split the commit into two clean branches off master
2. Cherry-picked the right files onto each branch
3. Generated commit messages following conventional commit format
4. Pushed both branches
5. Created both PRs with proper descriptions

My only manual step: assigning Copilot as the reviewer on each PR. That's the one thing that can't be automated yet.

Two PRs, properly scoped, with descriptions that actually described what changed and why. In the time it would have taken me to write one PR description manually.

## Where the Bottleneck Moves

Here's the pattern I keep seeing: every time you optimize one layer, the bottleneck moves to the layer above it.

- **Code generation** got fast → bottleneck moved to **code review**
- **Code review** got structured → bottleneck moved to **shipping** (PRs, commits, descriptions)
- **Shipping** got automated → bottleneck moved to **session management** (what to work on, in what order)

Each optimization reveals the next constraint. The session orchestrator addresses the latest one — but I'm already wondering what surfaces next. Probably something about *choosing the right sessions to have* in the first place. Strategic planning rather than tactical execution.

## What This Means for How I Work

The orchestrator changes the shape of a work session. Instead of:

> Open laptop → remember where I was → pick something → work on it → scramble to commit → close laptop

It's now:

> Open laptop → brain dump → agent classifies and plans → focus on one thing → agent packages results → close laptop

The difference isn't speed. It's cognitive load. I'm not holding the state of three repositories in my head anymore. The orchestrator externalizes that, and I get to spend my attention on the one thing that actually needs my judgment.

## The Recursive Part

There's something I can't ignore about this: I used an AI agent to build the orchestration system that manages my AI-assisted work sessions where I write a book about working with AI.

At some point the recursion either becomes absurd or it becomes the point.

I think it's the point. Each layer of meta-tooling isn't circular — it's a tighter loop. The orchestrator makes sessions more productive, which produces more material for the book, which generates more insights about how to work with AI, which improves the orchestrator.

The spiral goes up, not around.

## Try It Yourself

If your AI-assisted workflow is fast but your sessions feel scattered, here's the pattern:

1. **Brain dump** at session start. Don't filter. Don't organize.
2. **Classify by engagement.** What needs you? What doesn't?
3. **Protect your focus** for the single high-engagement task.
4. **Let agents handle logistics** — commits, PRs, documentation, branch management.
5. **Package results** at session end. Every session ends clean so the next one starts clean.

The question to ask yourself: *Am I spending my focused attention on the one thing that actually needs me, or am I spending it on logistics that an agent could handle?*

If you don't like the answer, build the container.
