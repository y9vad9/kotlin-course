# Random in Kotlin

I think you have come across the concept of "coincidence" many times.
It didn't matter whether it was a lottery or something else.
Our life is constantly beset by one or another accident. Let's take a look at how 
random works in Kotlin.

## Random

When talking about randomness in Kotlin, any Kotlin developer will immediately think of 
`kotlin.random` package that is built into Kotlin.

With its help you can:

- generate random numbers: integers (`Int`, `Long`) and floating point (`Float`, `Double`)
- generate a random logical type `Boolean`

:::tip It doesn't hurt to know
Also, `kotlin.random` can generate bytes and bits, but we haven't covered those types yet.
:::

Let's move on to the more practical part. **How is it all done?**

To get a random integer, we can use `Random.nextInt(from, until)` function:

```kotlin title="Main.kt"
import kotlin.random.Random

fun main() {
    println(Random.nextInt(0, 9))
}
```

Outputs:

```text title="Console"
8
```

That is, randomness is limited from 0 to 9.
:::caution Attention
There can be any numbers, the main thing is not to mix their
'from' with 'to' and not do the next `Random.nextInt(9, 0)`. There will be an error!
:::
Other functions work similarly:

```kotlin title="Main.kt"
import kotlin.random.Random

fun main() {
    println(Random.nextInt(0, 9))
    // highlight-next-line
    println(Random.nextLong(1L, 1000000L))
    // highlight-next-line
    println(Random.nextDouble(1.9, 9.9))
    // highlight-next-line
    println(Random.nextBoolean())
}
```

It will output something like this:

```text title="Console"
2
386039
7.176104912683028
false
```

Let's solve the following task:
:::info Task #1
The user enters a number from 1 to 30 (check the number). Make a program that will
guess the user's number and print how many tries it took to guess the given number.
:::
First, let's get a number and check it:

```kotlin {2-6}
fun main() {
    val number = readln().toInt()
    if (number < 0 || number > 30) {
        println("The number must be between 1 and 30.")
        return // exit the function
    }
}
```

Now, in order to guess the number, we can use the while loop operator

```kotlin {1,10-16}
import kotlin.random.Random // add the Random type to our namespace

fun main() {
    val number = readln().toInt()
    if (number < 0 || number > 30) {
        println("The number must be between 1 and 30.")
        return // exit the function
    }

    var attempt = 0 // make a variable to store the number of attempts
    while (true) {
        if (Random.nextInt(0, 30) == number) {
            println("The number was found for $attempt") // we do concatenation
            break // exit the loop
        }
        attempt++ // add 1 to attempt
    }
}
```

:::tip Interesting to know
Some obscure `attempt++`, right? It's actually just a simplification for
`attempt = attempt + 1`. It also exists in the other direction: `attempt--`.

By the way, this operation has two types:

- prefix increment / decrement
- postfix increment / decrement

In our case, this is a postfix increment. But how are they different?

The prefix increment first adds and then returns the value from the expression, while the postfix increment
increment first returns a value and then adds one. That is:

```kotlin
var x = 0
println(x++) // will output 0
println(x) // only here it will output 1

var y = 0
println(++y) // will print 1
```

:::
And we solved this simple problem.


