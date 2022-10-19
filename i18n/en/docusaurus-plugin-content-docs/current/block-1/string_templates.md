---
id: string_templates
---
# String interpolation
Remember string concatenation? In the previous topic about loops, we used it to
add text to the number, for example: `println("Sum: " + sum)`. What if I tell you that you can
do it easier?

In general, string interpolation was created to make code that has
many variables to output easier. The interpolation looks like this:
```kotlin
println("Sum: $sum")
```
That is, this method allows you to use the change directly in the line, 
without the addition operator.
:::info Information
Interpolation works with any type of data. Kotlin calls on any expression in
string function `toString()`.
:::

## Expressions
In addition to variables, interpolation also works with any expressions:
```kotlin
fun getString() = "xyz"

fun main() {
    println("getString() returns ${getString()}")
}
```
Curly brackets have been added to our dollar sign, which contains our expression.
:::caution Attention
You can make expressions of any shape and size, but I still recommend not to abuse them.
Also, it is important not to confuse the option for variables and expressions, although the option for expressions will work
for variables, on the contrary, you will not be able to do it:
```kotlin
val value = 100
println("value is $value") // ok
println("value is ${value}") // ok, but the IDE will tell us what is better to do according to the option above

println("getString() returns ${getString()}") // ok
// This will error
println("getString() returns $getString()") // not ok, kotlin will think you want to get a variable
```
:::
