# Scope Visibility

Now let's move on to a rather interesting, but somewhat complicated topic — **scope visibility**.
Previously, we looked at variables and functions, so now it's worth considering cases where a function or variable may
not be available or, conversely, available in some places.
**Scope** in programming is an important concept that **determines the availability of variables,
functions and other entities**. This concept divides variables, functions, etc. into global and local.
Let's consider an example:

```kotlin
fun foo() {
    val a = 1
}
fun main() {
    println(a + 1)
}
```

This code will throw an error:

```
Unresolved reference: a
```

Which means that the variable created in the function `foo()` is not available in the function `main()`.
Why? In this particular case, `a` cannot exist in theory either, because it is created when function `foo` is called,
and it is not called.
And if we call her?

```kotlin
fun foo() {
    val a = 1
}
fun main() {
    foo()
    println(a + 1)
}
```

Now it's created and, in theory, the program should work, but it doesn't, we get same error:

```
Unresolved reference: a
```

The thing is that variables are visible only at the place of creation and below in the hierarchy.
Below the hierarchy? Let's rewrite our code so that our variable is available:

```kotlin
var a = 0
fun foo() {
    a = 1
}
fun main() {
    foo()
    println(a + 1)
}
```

*(For clarity, we change the variable during the `foo()` call)*

This means "below the hierarchy."
A function using the `a` variable inherits the scope of the file in which it was created.
And so it works with any place where a variable is created. Even in the function:

```kotlin
var c = 2
fun foo() {
    var a = 2 // create functions at the function level.
    c = 4 // a variable outside the function (in the file) is available
    fun bar() {
        val b = a.pow(2) // variable `a` is available in function `bar` due to scope inheritance
        a = b
    }
    bar() // the function is available at the place of its creation (declaration)
    println(a) // the variable is available where it was created
}
```

Yes, yes, you can even create functions within functions in Kotlin, don't be surprised! Although not about that now.
In this case, the `bar` function inherits the file scope of the `foo` function and this can continue indefinitely. In
general, curly braces `{}` can be interpreted as an operator that creates a new scope.
Let's visualize how our scope is built:
![scope](images/scope_visibility_1.svg#invert)

That is, each new scope inherits the "parent" in which it is created.
Parents (everything higher in the hierarchy) cannot see what is created below it.

PS: In general, variables created in functions are called - **local variables** (functions are, logically, local
functions).
And variable that we created outside the function is "global". It is visible everywhere, starting with the same file
and ending with others.
Ending others? Just as we created a file named "Main", we can create any other file. At least,
to avoid keeping all the code in one file. This will make it easier to navigate in projects 
that are a little more complex than the ones we've done before.
What if we create another file where we create some functions and variables? Well, let's check:

```kotlin
// File: another.kt
val abc = 999_999_999
fun someFunction() {
    println("someFunction()")
}
```

Going into the "Main" file and trying to call these functions, we will be successful:

```kotlin
fun foo() {
    val a = 2
    println(a + abc) // we get the variable from the `another.kt` file
}
```

What does it mean? And this means that the file also, like, for example, a function, has a parent scope and these
are some other files.
Some other files? Not all?

The thing is that files are identified not only by their name, but also by their **package**.
Package? It is a unique identifier of any file.
What is a unique identifier and what is it for?
All for the same purpose that other files are created for: convenience. It is necessary to separate and sort the written
code.
From real examples, you can take system folders such as Music, Videos, Images and others, which contain information of
only a certain category.
Kotlin has a similar code categorization system, the only difference is the term (**package**).
Actually, as with system folders, we can make the structure of our project by dividing it into meaningful parts.
For example, for any mathematical calculations, we can create a package like this:
`math.calculations`.
In the file structure, we simply create the corresponding parts of the package (separated by a dot) folders:
That is, the `math` folder, and within it another `calculations` folder. After that, you can already create our code
files.
For example, let's create a file with a function that will solve the following expression:
$$
f(x) =\left\{
\begin{array}{ c l }
2x^2 & \quad \textrm{if } x < 0
\\
x & \quad \textrm{if } x \geq 1
\le 50
\\
(x \cdot 2)^2 & \quad \textrm{if } x > 50 < 200
\\
1 & \quad \textrm{otherwise}
\end{array}
\right.
$$

```kotlin
// Function.kt file
package math.calculations

// automatically added by our IDE (the identifier of our file)
fun f(x: Double): Double {
    return when {
        x < 0 -> 2 * x.pow(2)
        x >= 1 <= 50 -> x
        x > 50 < 200 -> (x * 2).pow(2)
        else -> 1
    }
}
```

As you may have noticed, above we have added a line of code with the location of our file.
It is required even if you placed it in the appropriate folder. This is because Kotlin allows the package to be
specified freely (ie you can create a file structure that does not match the package).
This is done in simple projects where there are 8-10 files and there are no problems with navigation, but I recommend
that you always create an appropriate file structure.
Well, let's move on to calling our function:

```kotlin
// Main.kt file
fun main() {
    println(f(1.0))
}
```

In theory, it should work, but when we run it, we get the following error:

```
Unresolved reference: foo
```

The thing is that by default, the scope is limited to the current package (in our case, although it is not there, it is
the same identifier, even if it is empty).
In order to get something from another scope (aka package), you need to "import" the ID first.
"Import" is done using the `import` keyword. It should always be indicated at the top, immediately after the package 
(well, or in its absence, just at the top).

The import scheme is as follows:

```kotlin
import [package].[id]
```

That is, to call the `f(x: Double)` function, we need to do the following:

```kotlin {2}
// Main.kt file
import math.calculations.f

fun main() {
    println(f(1.0))
}
```

And everything will start successfully!
But if the IDs of other packages are not visible without importing, is it possible to create duplicate names?
**Yes**, you can create duplicate names, except in situations where you are trying to create the same ID in one
particular scope.
That is, the following is prohibited:

```kotlin
fun main() {
    val a = 1 // Conflicting declarations: val a: Int, val a: Int
    println(a)
    val a = 2 // Conflicting declarations: val a: Int, val a: Int
    println()
}
```

But this is possible:

```kotlin
val a = 1

fun main() {
    println(a)
    val a = 2 // but don't do it like that))
    println(a)
}
```

This is because the preferred namespace (with our IDs) is the current scope (aka package).
This is because a function (or any other place) is a new independent scope.
We cannot be sure that sooner or later we will not import some variable or declare the same in the same file.
And inventing new names will not make the code easier, it will only make it more complex.
By the way, it is worth noting that creating duplicates in one package is impossible.

For Kotlin, a file is not an independent structural unit, and it exists only in your structure.
Remember the example with the function in the `math.calculations` package, do we specify a specific file when calling
the function or importing it? No. Therefore, duplicates in the same package are not possible, since it is impossible to
determine a specific identifier from a file.
Well, for confirmation, let's visualize everything that we discussed above:
![usage](images/scope_visibility_2.svg#invert)
We have a project with two unique packages: `math.calculations` and a parent (empty). The file "Main" is tied to the
function `f(x: Double)` in the `math.calculations` package (we have highlighted it with a line for visualization).
Well, let's make an interim summary:

- The program is divided into different scopes, which have a clear hierarchy depending on where and what you are
  creating.
- The hierarchy is usually: **package-level scope** -> **declaration-level scope** (functions, for example) -> **etc**. (for
  example, nested functions or conditional statements).
- The parent scope is the package that contains our identifier (function, variable). Other package IDs are not visible
  by default.
- If necessary, you can expand the namespace (identifiers visible in another scope) using
  import (`import [package].[identifier]`).

## Visibility modifiers

By the way, when I said that the file is not an independent structure, I lied a little and now I will explain why.
Let's solve the following example:
$$
f(x) =\left\{
\begin{array}{ c l }
x^2 & \quad \textrm{if } x < 0
\\
a(x) & \quad \textrm{otherwise}
\end{array}
\right.
$$
We have the function $a(x)$ as follows:
$$
a(x) =\left\{
\begin{array}{ c l }
2x & \quad \textrm{if } x > 0 < 200
\\
1 & \quad \textrm{otherwise}
\end{array}
\right.
$$
In Kotlin, we need to write the following (in the math.calculations.Function file):

```kotlin
fun f(x: Double): Double {
    return if (x < 0) x.pow(2) else a(x)
}
fun a(x: Double): Double {
    return if (x > 0 < 200) 2 * x else 1
}
```

Now, let's call the function `f(x)`

```kotlin
fun main() {
    val input = 2.0 // any number
    println(f(input))
}
```

And this is the end of our program, conditionally.
Looking at the function `a(x: Double)` we can think that it is used only in the function `f(x: Double)`
and in principle it is nowhere except file 'Function.kt' is not needed.
We can just ignore this function in the tooltips and not import it, however, if there are many such
functions? Or we need to hide something for something else.
This obviously clutters the global namespace, even if it is not imported.
Visibility modifiers come to our rescue! 

:::info
**Visibility modifiers** are keywords that describe where the identifier is
visible.
:::
For our case, there is a `private` modifier. It shows that the variable is visible only where it was created and below
it in the hierarchy.
In fact, the formula for creating the same function looks like this:

```kotlin
[visibility - modifier] fun [Function name](parameter: Type): Type { ... }
```

By default, the `public` modifier is implicitly applied to all declarations (functions, variables, etc.).
`fun main()` -> `public fun main()`.
In our case, we do the following:

```kotlin
private fun a(x: Double): Double {
    return if (x > 0 < 200) 2 * x else 1
}
```

By the way, specifying the same private identifiers in the same package, but in different files, is allowed, since a
conflict is simply impossible.

It will be the same with the variable:

```kotlin
private val a: Int = 0
```

## Conclusion

The initial consideration of the uniqueness of names, the creation of variables and functions was not as simple as you
already understood.
As I mentioned earlier, the function identifier is built on its following properties – name and parameters.
Given the topics discussed: *scope* and *visibility modifiers*, we also add them to the uniqueness of the identifier 
(it also called a 'signature').
And we do the same with the variable.
The final version of the identifiers will be:

- Function — visibility modifier + scope + name + set of parameters (difference in quantity or type).
- Variable – visibility modifier + scope + name.

It is advisable to play with it yourself for better understanding!