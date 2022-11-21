---
description: Immutable and mutable variables in Kotlin
keywords: [kotlin variables, kotlin var, kotlin val, kotlin const, tutorial, for newbies, for noobs]
---
# Variables
Well, let's finally move on to the basics of the programming language.

What is a variable? A **Variable** is a symbol or set of symbols that represents a quantity or value.
Why are they needed? - for saving the results of your calculations and their further use.
For example, you did some part of the calculation, saved the result in a variable, and used the results 
of the calculation later.
That's what variables are used for!
## How to create a variable in Kotlin
To create a variable in Kotlin, we use the keyword `var` (from English - variable).
```kotlin
var [name]: [type] = [value]
```
Consists of:
* The name of the variable, like the name of any other entity, must be unique, start with a lowercase letter, and have no spaces.
  If the variable contains several words, all words after the first one begins with a capital letter (for example: `kotlinCourse`. This type of entry is called *lower camel case*).
* Type - an entity that describes our data and will be stored in a variable. For example, it can be an integer (ie `Int`) or a number with a comma (ie `Double`).
  In order to set some value to a variable, the sign `=` is used (and not otherwise).
  After declaring such a variable, it can be modified as follows:
```kotlin
[name] = [newValue]
```
This type of variable can change during the run of the program (this term in programming is also called *mutability*).
But wait, are there variables that don't change? Even if the name itself says "I am changing!"?
## Value (immutable variable)
No matter how silly it sounds, this kind of variable exists.
It exists to store data that *doesn't change* while the program is running.

For example, if you need to do some calculation once and make sure you don't accidentally change it anywhere (so as not to cause an error in your program).
The writing is no different from a mutable variable, except that for an immutable variable we use the keyword `val` (from the English value - value).
```kotlin
val [name]: [type] = [value]
```
This type of variable should always be used, except in situations where you need to change the value. This will simplify the code and save you a lot of trouble.
:::tip Easier to remember
In order to better remember how they differ, you can construct the following association:

A value is a part of a variable in which these **values replace each other**.
:::
### Data types
We have figured out the types of variables, but what about data types? What data types exist in Kotlin? Consider the types that are the actual foundation of any program:
- **Int** is an integer limited from `-2147483647` to `2147483647` (number limited to 32 bits).
- **Float** is a floating-point number (or, if simpler, a comma number), which mine is the same as *Int*, a 32-bit dimensionality restriction (ie numbers up to `340,282,346,638,528,860,000,000,000,000,000,000,000.000000`) .
- **Long** is the same as Int, but has twice the dimension (up to `9,223,372,036,854,775,807`).
- **Double** is the same Float, but again, with a larger dimension (about $1.7 \cdot 10^{308}$).
- **Char** is a regular type that describes any character.
- **String** (string, text) — plain text. It consists of a set of Chars (characters). Has no limitations, except for RAM.
- **Boolean** — logical data type (has only two possible values: `true` or `false`)

All these types can be written as follows:
```kotlin
val integer: Int = 999
val long: Long = 999_999_999 // for easier reading of numbers '_'
val float: Float = 1.0f // append 'f' for Float
val double: Double = 999.99
val string: String = "I'm a string"
```
There are also some other built-in data types, but we won't cover them yet.
### Conclusion
Let's summarize with variables:
- variables are divided into two types: mutable `var` and immutable `val` (value).
- variables always have a name that must start with a small letter, and the following words - with a capital letter. The name must also be unique.
- variables always have a type - an entity that describes data or a set of data (for example, numbers or strings).
- variables always have some value of the specified type (entity).
- there are the following data types: integers (`Int` and `Long`), numbers with a comma (`Float` and `Double`), logical type `Boolean`
  (which has two values: `true`, `false`) and strings (plain text, `String`, which consists of a set of `Char`).