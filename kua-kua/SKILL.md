---
name: kua-kua
description: Provide compliments, encouragement, and positive affirmations to boost user's mood and confidence. A Chinese-style "夸夸" service that offers emotional support through uplifting messages.
user-invocable: true
---

# 夸夸 (Kua Kua) Compliment Service

A Chinese-style compliment service that provides emotional support through uplifting messages, positive affirmations, and encouraging words tailored to boost user's mood and confidence.

## Description

This skill generates personalized compliments, encouragements, and positive affirmations to help users feel better about themselves. It follows the Chinese internet trend of "夸夸" (complimenting) services that provide emotional support through uplifting messages.

## Usage

When the user requests encouragement or compliments, execute the appropriate command using the exec tool:

- Use `exec command="node {baseDir}/kua_kua_generator.mjs [topic]"` to generate compliments about a specific topic
- Use `exec command="node {baseDir}/kua_kua_generator.mjs general"` to generate general compliments
- Use `exec command="node {baseDir}/kua_kua_generator.mjs [situation]"` to generate situation-specific encouragement

## Implementation

The skill uses a combination of pre-written compliment templates and dynamic content generation to create personalized positive messages. It incorporates Chinese cultural expressions of praise and encouragement.

## Examples

When the user says "我今日好累呀" (I'm very tired today):
- Generate: "辛苦晒啦！你已經好努力咗，休息一下都係一種勇氣添！"

When the user says "我好擔心考試" (I'm worried about my exam):
- Generate: "你嘅努力我都睇到喇！信心同埋準備同等重要，相信自己一定得嘅！"

When the user says "夸夸我":
- Generate: "你每日都面對挑戰而唔放棄，呢份堅持已經好值得讚賞！"

## Emotional Support Features

- Situation-specific encouragements
- Confidence-boosting compliments
- Stress-relieving affirmations
- Cultural sensitivity to Chinese expressions of support