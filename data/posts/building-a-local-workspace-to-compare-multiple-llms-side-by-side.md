---
title: "Building a Local Workspace to Compare Multiple LLMs Side by Side"
date: "2026-03-20"
author: "ISA"
---

Hi guys, it's me again.

I pushed a new project to GitHub recently, and this one came out of a very practical need.

Over the last few months, I kept switching between different AI tools, opening too many tabs, copying the same prompt over and over, and trying to remember which model gave the most useful answer. After doing that enough times, I got tired of the workflow itself. I did not want more noise, more landing pages, or another overdesigned AI product. I just wanted a clean local workspace where I could send one prompt to multiple models and compare the results side by side.

So I built **Multi-LLM Comparison Workspace**.

The idea is simple. You write one prompt, send it once, and the app returns responses from multiple LLM providers in parallel inside the same workspace. Each model gets its own column, so the differences are immediately visible. Instead of jumping between tabs and losing context, everything stays in one place.

What I like most about this project is that it stays focused on utility.

It opens directly into the workspace instead of wasting time on a landing page. It keeps chat history, prompts, model responses, preferred answers, and continuation state in a local SQLite database. It also supports multi-turn conversations, which means it is not just a one-shot comparison toy. You can actually continue working inside the same flow and see how different models evolve over time.

One feature I especially enjoyed building was the ability to continue a conversation from a specific model response.

Sometimes one model gives the best direction, but you still want to keep comparing from that exact point onward. I wanted that branching logic to feel simple instead of complicated, so I designed it in a way that lets me pick a response and continue from there on the next turn. It is a small feature, but it changes the experience a lot when you are testing ideas, prompts, or different reasoning styles.

The project also includes an integrations screen for configuring providers like OpenAI, Gemini, Anthropic, xAI, and DeepSeek. Since this is meant to be local-first, the whole thing is built around the idea that your workspace should stay under your control. You can manage API keys, choose default models, enable or disable providers, and test whether each connection is working.

From a technical side, I built it with **Next.js, React, TypeScript, Tailwind CSS, Prisma, and SQLite**. I wanted the stack to feel modern but still lightweight enough for a project like this. I did not want unnecessary complexity. I wanted something I could extend easily later when I feel like adding more providers, better comparison tools, or more detailed prompt workflow features.

This project is not trying to be a startup pitch.

It is more like a tool I genuinely wanted for myself.

That is probably why I like it. It came from actual frustration, not from trying to chase a trend. I think some of the best personal projects start exactly like that. You get annoyed by a repeated problem, and instead of complaining about it forever, you sit down and build your own version of the solution.

There is still a lot I can improve here.

I want to refine the workspace experience more, make the comparison flow even smoother, and possibly add more advanced filtering or evaluation features later. But in its current form, it already does what I wanted it to do, and that feels good.

It solves a real problem in my daily workflow, and that is enough reason for me to keep working on it.

You can check out the project here:

**GitHub:** https://github.com/saitakarcesme/multi-llm-comparison-workspace

I will probably write a deeper technical post about the architecture and design decisions later when I have more time.

See you soon.
