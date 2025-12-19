## How It Works

The dice roller simulates rolling physical dice using your device's random number generator. Each roll is completely independent—previous results have no influence on future rolls, just like real dice.

### Using the Tool

1. **Number of Sides**: Choose how many sides your dice have (2–1000). Common choices include d6 (standard dice), d20 (tabletop RPGs), and d100 (percentile).

2. **Number of Dice**: Select how many dice to roll at once (1–100).

3. **Display Mode**: Toggle between seeing the total sum or individual roll results.

## The Math Behind It

Each die roll is an independent event with uniform probability. For a die with _n_ sides:

- Probability of any single outcome: **1/n**
- Expected value (average) of one die: **(n + 1) / 2**
- For multiple dice, the total follows a probability distribution centered around **dice × (n + 1) / 2**

### Example: Rolling 2d6

When rolling two six-sided dice, the minimum is 2 and maximum is 12. However, 7 is the most common result because there are more ways to make 7 (1+6, 2+5, 3+4, 4+3, 5+2, 6+1) than any other number.

## Common Dice Types

| Notation | Sides | Common Uses             |
| -------- | ----- | ----------------------- |
| d4       | 4     | Damage in D&D           |
| d6       | 6     | Board games, Yahtzee    |
| d8       | 8     | Weapon damage           |
| d10      | 10    | Percentile rolls        |
| d12      | 12    | Barbarian damage        |
| d20      | 20    | Attack and skill checks |
| d100     | 100   | Critical hit tables     |

## Random Number Generation

This tool uses `Math.random()`, which provides a pseudorandom number generator (PRNG). While not cryptographically secure, it's perfectly suitable for dice rolling and games. For applications requiring true randomness (like cryptography), specialized hardware or services like [random.org](https://random.org) should be used.
