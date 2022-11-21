---
description: for, while, do-while and iterator (progressions and ranges) в Kotlin
keywords: [kotlin cycles, recursions, kotlin ranges, progressions, tutorial, for newbies, for noobs, for, while, do-while, iterator, iteration, progression, range]
---
# Loops and Recursions

Now, let's move on to a rather interesting, but, again, a bit difficult topic — cycles.
To better understand what cycles are, let's create a task. For example, let's take the task that we solved in the last
topic.
In order to solve the equation using input, we run our program each time.
What if we make infinite input in our program so that we don't have to restart our program every time?

In general, without our topic of loops, it could well be solved as follows:

```kotlin
fun main() {
    println("Enter a number:")
    val input: Double = readln().toDouble()
    println("Result: " + input.toString())
    return main() // at the end of the function, we simply call it again
}
```

And now, the solution is found!

This is called recursion. In simple words, this is the concept of declaring (writing, describing) the function code
through itself.
It is like a nesting doll, which in our case has no end.

Well, how do we end our program now? You can, of course, do this by forcibly closing the program process through
system tools or an IDE, but let's be human and make some sort of exit mechanism.

In order not to worry too much, let's enter the condition that to exit the program we need to write ":q".

```kotlin
fun main() {
    println("Enter a number: (or use :q to exit):")
    val input: String = readln() // create a variable with text because we need to validate user input
    if (input != ":q") {
        val input: Double = input.toDouble() // the power of scopes!
        println("Result: " + f(input).toString())
        main()
    }
}
```

This will also remain a recursion, but not infinite (we have a condition).

Well, considering a fairly simple example of recursion, which you could come up with yourself while trying to solve the
problem with restarting the solution of the equations.

So what are cycles?
:::info Definition
**Cycles** are language tools that reproduce recursion.
They are also classified as operators, called *cyclic* operators.
:::

So now let's see how it can be solved by other means of language. You will not always create separate functions for
'repetition of something', right?

## While

To make your life easier, they invented a rather useful construction - `while`.
It is written like this:

```kotlin
while (boolean) {
// this is a repeating action
}
```

A similar construct executes its contents in `{}`, but looks at a condition (aka boolean expression) before each
execution
and if there is `true`, then the content is executed, and if `false` - not.

Our previous code can be expressed via `while` as follows:

```kotlin
fun main() {
    var shouldRun: Boolean = true
    while (shouldRun) {
        println("Enter a number (or use :q to exit):")
        val input: String = readln()
        if (input == ":q") {
            shouldRun = false // at the next execution, the loop will see that the condition is `false'
        } else {
            val input: Double = input.toDouble()
            println("Result: " + f(input).toString())
        }
    }
}
```

Here is our first cycle! But it's kind of complicated, don't you think?
All this can be simplified by using special additional operators: `break` and `continue`.

What do these two operators do? Let's figure it out.

- `break` - forcibly ends the cycle.
  That is, even if the condition is `true', the cycle will still end.
- `continue` - ends the execution of the current *repetition*.
  Unlike `break`, `continue`, roughly speaking, exits the code (the code after it is not executed) and goes immediately
- to the next iteration (before checking the condition and further iteration if it is `true`).

Let's rewrite our code:

```kotlin
fun main() {
    while (true) { // we don't need the condition
        println("Enter a number (or use :q to exit):")
        val input: String = readln()
        if (input == ":q") {
            break // exit the cycle
        } else {
            val input: Double = input.toDouble()
            println("Result: " + f(input).toString())
            continue // in general, it is optional in our case, but we will add it for clarity
            println("I won't print!") // The IDE will tell us that we will never reach this part of the code via continue
        }
    }
}
```

Out of necessity, we threw away the `shouldRun` variable, because there is a much more convenient way with `break`.

### Do-while

One subtype of the while loop is `do-while`. Apart from the name, it differs in that in **do while** first
the loop body is executed and then the loop continuation condition is checked. Because of this feature **do
while** is called a loop with a *postcondition*, but an ordinary **while** is called a loop with a *precondition*.

It is written like this:

```kotlin
do {
    // something
} while (bool)
```

In such a loop there are also `break` and `continue`, which do not differ.
However, our task can be solved through **do-while** and without them:

```kotlin
// create a variable with a message to reuse later
private val numberInputMessage = "Enter a number (or :q to exit):"

// create a separate function for convenience
private fun requestInput(message: String): String {
    println(message)
    return readln()
}

fun main() {
    var input = requestInput(numberInputMessage)
    do {
        println("Result: " + f(input.toDouble()).toString())
        input = requestInput(numberInputMessage) // get next input to check after iterating what was entered
    } while (input != ":q") // if the input is not ":q" the program will continue to run
}
```

For convenience, we created a function and a variable that combined similar code. Made a variable outside the loop and
write again
it at the end of the loop (to check after repeated user input).

This is an alternative solution, although not the best.

## For

And now let's move on to an equally important type of loops - `for`.
The difference of this type of loops is that it is not built on a condition, but on an iterator.
What is an iterator? An iterator is a built-in utility in the language that passes between some sum of elements.
That is, each *repeat* will correspond to one element in this sum.
In our case, this sum of elements will correspond to the range, and the element will be the counting unit of this range.

What is range? In simple words - an interval of values of any value.
An example of a range can be \[0; 5\] (describes the interval of numbers from 0 to 5, inclusive).
There are different kinds of ranges, but for now we'll look at the simplest one, an integer range.

How to create such a cycle? To begin with, consider the progression with integers:

```kotlin
for (i in 0..5) {
    println(i)
}
```

Here we see the `in' operator, which works with an iterator (in our case, with what it expresses - a range).

This code will print the following:

```
0
1
2
3
4
5
```

Pretty obviously works, right?

Let's solve the following task:
:::info Task
Reproduce the exponent function for positive numbers.
Equivalent to `Int.pow(x: Double)` function.
:::

```kotlin
fun pow(number: Int, times: Int): Int {
    var output = number // create a variable where the multiplied value is stored
    for (i in 1..times) { // through the range, indicate how many times the loop should repeat
        output *= number // multiply what is already there by the number parameter
    }
    return output // return a number in powers
}
```

Here the IDE will tell us that the identifier is not used and it is desirable to replace it with `_`.
The thing is that in Kotlin, according to the code style, it is accepted that identifiers that are not used are named
exactly like that.

As for the task, there is a simple imperative version of the solution.

Let's solve one more task:
:::info Task
Write a program where the user enters **any positive integer.**
And the program sums up all the numbers from 1 to the number entered by the user.
For example, if the number 4 is entered, we must add up the following numbers: 1+2+3+4.
:::

Ranges will help us a lot in this!

```kotlin
fun sum(input: Int): Int {
    var output: Int = 0 // create a temporary variable that will store the value that changes in the loop

    for (i in 1..input)
        output += i // it is possible to remove `{}`, because there is only one sequence of actions

    return output
}
```

We created a temporary variable and reused the ranges with the variable `i`,
containing an interval element of this range for each iteration (repetition) of the loop
(which corresponds to what we essentially do).

And finally, let's solve one more task:
:::info Task
Given natural numbers from 1 to 50. Find the sum of them that is divisible by 5 or 7.
:::

:::tip Remember
Before solving this problem, let's remember one of the arithmetic operators - `%` (remainder from division).

```kotlin
fun main() {
    println(22 % 4)
    println(4 % 2)
}
```

It will print `2` and `0`, since there will be such a remainder after division (in the first one, the integer is not
fully divided, in the second - it is fully divided).
:::

Our task is to find numbers that are evenly divisible by 5 and 7.
This would be equivalent to the following:

```kotlin
number % 5 == 0 || number % 7 == 0
```

This condition will suit us. Now it remains only to make a loop and a temporary variable in which we will add the
result.

```kotlin
fun main() {
    var temp: Int = 0
    for (i in 1..50)
        if (i % 5 == 0 || i % 7 == 0)
            temp += i
    println("Amount: " + temp)
}
```

The answer is `436`.
