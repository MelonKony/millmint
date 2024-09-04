---
title: Assembly Language
fulltitle: Common Assembly Language
icon: ⌨️
emoji: ɋ
color: purple
image:

type: blank
draft: false

aliases:
- /common-assembly-language/
---
**Common Assembly Language** (commonly *Assembly* or *COMAS*) is the common low-level programming language of [computers](/computers/) in {{<link/vekllei>}} and around the world. It was established by Bell Electric in 1977 and was developed from prior experimentation with machine code translation as early as the 1940s. It translates low-level instructions addressed to the processor of an optical-electric computer into an alphabet mnemonic system more easily understood by humans.

Each command is represented by a unique sequence of balanced ternary digits called a *trit*. The commands cover basic operation of a computer, including arithmetic, data allocation, control flow and logical operations. These trits represent one of three states, which in optical computing can be executed in parallel:

* `+`: positive, otherwise represented as `+1`
* `o`: zero, otherwise represented as `0`
* `-`: negative, otherwise represented as `-1`

The following table lists the common commands of mnemonic Assembly and its equivalent machine-code representation as trits.

| **Assembly Command** | **Mnemonic** | **Trit Representation** |
|----------------------|--------------|-------------------------------------|
| **Add**              | `ADD`        | `+++`                               |
| **Subtract**         | `SUB`        | `---`                               |
| **Move**             | `MOV`        | `+--`                               |
| **Load**             | `LOD`         | `-+-`                               |
| **Store**            | `STO`         | `--+`                               |
| **Jump**             | `JMP`        | `+0+`                               |
| **Jump if Zero**     | `JIZ`         | `0++`                               |
| **Jump if Negative** | `JIN`         | `0--`                               |
| **And**              | `AND`        | `+-+`                               |
| **Or**               | `OR`         | `0+0`                               |
| **Not**              | `NOT`        | `0-0`                               |
| **Increment**        | `INC`        | `00+`                               |
| **Decrement**        | `DEC`        | `00-`                               |
| **Compare**          | `CMP`        | `+0-`                               |
| **No Operation**     | `NOP`        | `000`                               |
