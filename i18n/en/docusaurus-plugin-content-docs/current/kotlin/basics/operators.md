---
description: Mathematical, logical and conditional operators in Kotlin
keywords: [kotlin operators, tutorial, for newbies, for noobs, if, when, math]
---
# Operators

In programming, an operator is a symbol that represents some kind of action on an entity (for example, a number that is
divided by another number).
This is a function that has its own special symbol in the programming language dictionary (as it does with the `fun`
or `var` keywords, for example).
Let's take division itself as an example. To do division, we can use the `/` symbol.

```kotlin
val result: Int = a / b
```

Another way to express it is as follows:

```kotlin
fun divide(a: Int, b: Int): Int {
    ...
}
```

But, for convenience and understanding, we decided to shorten it to `/`.
However, you still have the option to verbally invoke it:

```kotlin
val result = a.div(b) // div is short for divide
```

Now, knowing this, try to solve the problem on your own:
$f(y)=\frac{y}{2}$

This task is quite simple:

```kotlin
fun f(y: Int): Int {
    return y / 2
}
```

Not much different from adding numbers.
But what other operators are there?

## Types of operators

Operators share the following types:

- arithmetic - adding numbers, subtracting, multiplying, dividing.
    * `+` operator for adding values ​​(`a + b`)
    * `-` value subtraction operator (`a - b`)
    * `*` value multiplication operator (`a * b`)
    * `/` value division operator (`a / b`)
    * `%` division operator with remainder (`22 % 4` will be equal to `2`)
    * compound operators:
        - `+=` operator adds another value to the current value.
          Equivalent to the following: `a = a + b`.
        - `-=` operator subtracting the value from the current value.
          Equivalent to the following: `a = a - b`.
        - `*=` operator for multiplying the current value by some value.
          Equivalent to the following: `a = a * b`.
        - `/=` operator for dividing the current value by some value.
          Equivalent to the following: `a = a / b`.
        - `!=` operator 'not equal', corresponding to `!(n == 1)` (brackets are used to summarize the results of
          expressions)
- logical - comparison of values:
    - `>` operator greater than (`a > b`)

    * `<` operator less than (`a < b`)
    * `&&` the 'and' operator (`a > b && b < c`: `a` is greater than `b` and `b` is less than `c`)
    * `||` operator 'or' (`a > b || c < a`: `a` is greater than `b` or `c` is less than `a`)
    * `==` equality operator of two values ​​(`a == 5`)
    * `!` the opposite operator (if we have `false`, it turns into `true` and vice versa)
    * compound operators:
        * `>=` operator greater than or equal to (`a >= 5`)
        * `<=` operator less than or equal to (`a <= 5`)

* and conditionals that work with logical operators:
    * `if' operator 'if this is true, then something'. Works in cooperation with `else`: "if this is true, then this,
      but if not, then (code fragment from else)".
    * `when` operator for multiple 'if this is true then ..'

:::caution
It is important to note that **comparing different types
data is not possible** (but this does not apply to numbers).
That is, if we compare a string, for example, with a number - **we will have a compilation error**.
:::

### Logical operators

Let's consider logical operators that return the
type `Boolean` in the language, where there are only two possible values (options): `true` (truth) and `false` (not
true, a lie).

To clarify the work of some operators, let's solve a few very simple tasks:

:::info Task #1.
Create a function that will tell is x is greater than y.
x, y are integers.
:::
Let's solve this simple problem:

```kotlin
/**
 * We give the function two parameters of type `Int`.
 * We return the logical type `Boolean`, which is formed thanks to the comparison operation `>`.
 */
fun isBigger(x: Int, y: Int): Boolean = x > y
```

:::info Task #2.
Create a function that checks whether a number is zero.
:::

:::tip Tip.
For this we need the operator 'not equal' (`!=`).
:::

```kotlin
fun isNonZero(x: Int): Boolean = x != 0 // everything is very simple
```

:::info Task #3.
Create a function that checks whether a number is exactly divisible by 3.
:::

:::tip Tip.
To solve this problem, we will need to use the remainder operator
from division (ie `%`).
:::

If a number is divided as a whole by another number, it is logical that the remainder of the division will be nothing,
i.e. `0`.
This means that we need to combine two operators - remainder from division and equality.
That is, you need to do the following `n % 3 == 0` (`n % 3` is executed first, because the expressions are read from
left to right).

```kotlin
fun isDivisibleOnThree(x: Int): Boolean {
    return x % 3 == 0
}
```

### Conditional operators

Let's pay more attention to conditional operators.

In order to make a program that relies on some conditions that need to be processed (for example, like the case we
discussed above), use conditional statements.
The name itself tells us that we have a condition. Let's analyze some types of conditional operators in Kotlin.

### If else

One of the conditional statements is `if-else`.
A very simple construction that means "if this is true, then do this, if not, then this".
It is written like this:

```kotlin
...
val isBigger: Boolean = a > b
if (isBigger) {
    println("a is greater than b!")
} else {
    println("b is greater than a!")
}
```

But what if we have several conditions? For example, we need to find out the most out of three x arbitrary.
Using logic, one can come to the point that one more `if` can be added to `else {...}`. And it will be right! This will
work.

```kotlin
fun getBiggest(a: Int, b: Int, c: Int) {
    if (a > b && a > c) { // here, by the way, the logical operator 'and' is used
        return a
    } else {
        if (b > a && b > c) {
            return b
        } else {
            return c
        }
    }
}
```

However, the code has noticeably become much more complex. Can it be simplified?
Yes, indeed, this construction can be simplified.
For if, as for else, one simplification is used:

- If you have only one chain of actions, it is not necessary to specify curly brackets.
  That is, the following will result:

```kotlin
if (a > b && a > c)
    return a
else if (b > a && b > c)
    return b
else return c
```

Now the code has become noticeably better than before. But, friends, the magic doesn't end there:

```kotlin
return if (a > b && a > c) {
    a
} else if (b > a && b > c)
    b
else c
```

Wow, what is this? If you have studied other programming languages before, you may know about the "ternary operator".
Well, Kotlin decided to make it possible to use the conditional if-else statement (and, looking ahead, the `when`
statement as well) as an *expression* (anything that can express a value: a raw value of type `10`, a function that
returns some value and something else, which as a result returns us some value, is called an *expression*).

What does it mean? This means that the code fragments in the `if` will act as conditional functions that return some
value (a number or something else) from each branch of the condition that is processed. In order to return something
from a code snippet, we need to write the value (or a variable/function that will have the value we want) last in our
code snippet.

Let's fix the material by doing the following:
:::info Task
Execute the following expression in Kotlin:
$$
f(x) =\left\{
\begin{array}{ c l }
x & \quad \textrm{if } x \geq 0
\\
2x & \quad \textrm{if x < 0}
\end{array}
\right.
$$
:::
Here we have only two values, which makes the problem very primitive:

```kotlin
fun f(x: Int): Int {
    return if (x >= 0)
        x
    else 2 * x
}
```

Okay, not hard. But what if we have more conditions? Make endless if-else chains?
With Kotlin, of course, not.

### When

A `when` operator was created for a large selection of conditions.
To understand what cases it is used for, let's solve the following task:
:::info Task #1.
Create a function that returns the day of the week by its sequence number.
That is: if you enter the parameter '1' into the function, the function will return "Monday". And so on.
:::

For this, we can use the `when` operator, which will be much clearer than the endless `if-else` chains.

```kotlin
fun getDay(ordinal: Int): String {
    return when {
        ordinal == 1 -> "Monday"
        ordinal == 2 -> "Tuesday"
        ordinal == 3 -> "Wednesday"
        ordinal == 4 -> "Thursday"
        ordinal == 5 -> "Friday"
        ordinal == 6 -> "Saturday"
        ordinal == 7 -> "Sunday"
        else -> "Invalid number specified"
    }
}
```

It is worth noting `else`, which also exists in the `when` statement. Works similarly, handling a condition that has not
been satisfied before.
In our case, if a number greater than 7 is entered into the function, a message will be returned that the specified day
is incorrect.
By the way, the conditions look somewhat similar, don't they? "Somehow there's a lot of gloom," Kotlin said, and made
another simplification:

```kotlin
fun getDay(ordinal: Int): String {
    return when (ordinal) {
        1 -> "Monday"
        2 -> "Tuesday"
        3 -> "Wednesday"
        4 -> "Thursday"
        5 -> "Friday"
        6 -> "Saturday"
        7 -> "Sunday"
        else -> "Invalid number specified"
    }
}
```

How everything became clearer and more obvious, didn't it?
To remember more the material, we will solve the following task:

:::info Task #2.
Make the following function in Kotlin:
$$
f(x) =\left\{
\begin{array}{ c l }
x + 1 & \quad \textrm{if } x < 0
\\
2 x & \quad \textrm{if } x \geq 1
\le 10
\\
x + x & \quad \textrm{if } x > 10
\\
0 & \quad \textrm{otherwise}
\end{array}
\right.
$$
:::
In this expression we have a total of 4 conditions. Our `when` is just right for this:

```kotlin
fun f(x: Int): Int {
    return when {
        x < 0 -> x + 1
        x >= 1 <= 10 -> 2 * x
        x > 10 -> x + x
        else -> 0
    }
}
```

:::tip Supplement
You can also announce your operator options yourself,
but we will talk about that some other time.
:::