---
id: math_operations
---

# Mathematical operations in Kotlin

Well, we have considered the ground on which the program can already be built.
Earlier, we already considered one of the built-in functions - `println`. This function printed the text we gave it to
our terminal (console).
Let's consider others.
Let's go to the task: we need to write a program that will multiply the numbers entered by the user. Pretty simple.
:::tip Tip
In order to receive user input, we will need a function `readln(): String` that reads user input from the console.
It is built into the language, and as you can see, it returns a string.
:::
That is, we will have something like:

```kotlin
fun main() {
    val number1: Int = readln()
    val number2: Int = readln()
    println(number1 * number2)
}
```

Here is the whole program! But when we try to run it, we get an error:

```
Type mismatch: inferred type is String but Int was expected
```
What does it mean? This means that our variables `number1` and `number2` are of type `Int` (integers)
an inappropriate `String` type (string, aka plain text) is set.
:::caution Attention
Unfortunately, since user input can be anything: from numbers to letters and any other characters,
so function `readln()` returns type `String` (a string that can contain not only numbers).

To fix this, we have to convert the string to an integer (well, it's a good idea to check the user's input first).
Kotlin has a `toInt()` function for strings (aka text), which makes our lives a lot easier. It converts a string to a
number.
:::

```kotlin
fun main() {
    val number1: Int = readln().toInt()
    val number2: Int = readln().toInt()
    println(number1 * number2)
}
```

:::tip Interesting to know
Similar functions also exist for other types of numbers:

- `String.toDouble()`
- `String.toShort()`
- `String.toFloat()`
- `String.toLong()`

Similar functions also exist between numbers. For example, an integer can be converted to a floating point number (aka a
point number, like `Double`).
What is it for? Well, for example, you need to add one integer and one floating point number.
:::
Since Kotlin is a strictly typed language, it will not work to simply add up numbers of different types. Depending on
what you need, you can cast a floating point number to an integer and vice versa.

```kotlin
val x = readln().toInt()
val y = readln().toDouble()
val double: Double = x.toDouble() + y
println(double)
val integer: Int = x + y.toInt()
println(integer)
```

In general, if you try to compose `x+y` without transformations, Kotlin will automatically infer the type `Double`. But,
under the hood, what we just discussed is being done. But this only works with numbers.

```kotlin
val x = readln().toInt()
val y = readln().toDouble()
val result: Double = x + y
println(result)
```

:::tip Interesting to know
By the way, the `println` function also outputs a string to the console. And we give her a number. Why are there no such
restrictions for her?
It's simple: the function `println` accepts the type `Any` (that is, any type of data) and implicitly calls `toString()`
on this type
(the same built-in function in the language that applies to any created object),
which returns a string with our number.
Inside there is something like this:

```kotlin
fun println(value: Any) {
    val string: String = value.toString()
// ...
}
```

:::

What other interesting features are there?
Let's solve the following task, while mentioning conditional operators:
$$
f(x) =\left\{
\begin{array}{ c l }
3x & \quad \textrm{if } x < 0
\\
x^{5} & \quad \textrm{if } x \geq 1
\le 100
\\
\sqrt{x} & \quad \textrm{otherwise}
\end{array}
\right.
$$
And here we see the degree! Well, knowing what a degree is, it is not difficult to solve this task.

*I prefer for more than two branches with conditions, to use `when`.*

```kotlin
fun f(x: Double) {
    return when {
        x < 0 -> 3 * x
        x >= 1 && x <= 100 -> x * x * x * x * x
        else ->? // what's here?
    }
}
```

If we have figured out the degree, what should we do with the root?
:::tip Tip
In order to get the root of a number, we can use the `sqrt(x: Double)` function.
:::
As a result, we will have the following:

```kotlin
import kotlin.math.sqrt

fun f(x: Double) {
    return when {
        x < 0 -> 3 * x
        x >= 1 && x <= 100 -> x * x * x * x * x
        else -> sqrt(x)
    }
}
```

And our task is solved! But if we're talking about built-in functions, surely there's some kind of exponentiation as
well?
Especially if you think about what would happen if the degree was greater.
Yes, there is a simplification.
:::tip Tip
In order to exponentiate a number, we can use the function `Int.pow(times: Int)`.
:::
You can do as follows:

```kotlin
import kotlin.math.sqrt
import kotlin.math.pow

fun f(x: Double) {
    return when {
        x < 0 -> 3 * x
        x >= 1 && x <= 100 -> x.pow(5)
        else -> sqrt(x)
    }
}
```

Very comfortable! Especially if we have an arbitrary degree.
Let's output the result to the console:

```kotlin
fun main() {
    val input: Double = readln().toDouble()
    val output: String = f(input).toString()
    println(output)
}
```

:::info Task
Execute the following expression in Kotlin:
$$
f(x) =\left\{
\begin{array}{ c l }
3x^{10} & \quad \textrm{if } x \geq 1
\le 20
\\
\sqrt{x} & \quad \textrm{if } x > 20 \le 100
\\
\lvert x^{3} \rvert & \quad \textrm{otherwise}
\end{array}
\right.
$$
:::
From the new, here we see the module (or absolute number). If you are not familiar with
the concept of an absolute number or module, then do not worry. All you need to know -
is that the conditional $\lvert y \rvert$ always returns a positive (not negative) number.
:::tip Tip
This problem can be solved in several ways. One of the options follows from the basic rule
mathematicians: **minus for minus always gives a plus**.

That is, having a negative number, all we need is to add another minus to it:

```kotlin
val negativeNumber = -1
val positiveNumber = -negativeNumber // this variable already has a positive value.
```

With this rule, you can flip the number, but don't forget to check
whether the number is negative at all.

That is, you can do the following:

```kotlin
fun absoluteNumber(x: Int): Int {
    return if (x < 0) // check if the number is negative at all
        -x // the number is negative, we turn it over
    else x // the number is positive, we leave it as is
}
```

So we made an analogue of the function `abs(x: Double)` from the built-in library of mathematical functions
Kotlin. We can use what we wrote, but we will take a ready version.
:::
So, using knowledge about `when` and `pow`, `sqrt`, and `abs` functions, we will complete the task:

```kotlin
import kotlin.math.sqrt
import kotlin.math.pow
import kotlin.math.abs

fun f(x: Double): Double {
    return when {
        x >= 1 <= 20 -> 3 * x.pow(10)
        x > 20 <= 100 -> sqrt(x)
        else -> abs(x.pow(3))
    }
}
```

And we solved this task so easily.
:::info Other functions
And from other interesting functions, I would like to mention the following:

- `max(x: Double, y: Double)` – returns the maximum number between x and y.
- `min(x: Double, y: Double)` – returns the maximum number between x and y.
  :::
  There are quite a lot of similar functions, so we will consider them during the passage of other topics.