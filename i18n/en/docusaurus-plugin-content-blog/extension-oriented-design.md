---
title: Extension Oriented Design
description: Why is extending your own classes a good idea?
authors: vadim-yaroschuk
---
# Extension of classes
With the emergence of different approaches to writing code, people divided the code in different ways: 
first into functions, then into objects and finally on modules and individual projects. 
Let's analyze an approach that does not create a new programming paradigm, but creates new approach 
to code-writing: **Extension oriented design**.

## But why do we need extensions?
In fact, there are several reasons, so let's check them all.
### Lack of access to actual class
The first and most obvious reason we need an extension function is because we don't have access to the original class.
One of the solutions usually is class inheritance. And it works fine until
when our class is not final or our class is not primitive type. Such problems can be solved by creating 
static functions in, for example, Utils classes or elsewhere.

And here we smoothly approach what extension functions were created for - to make static helper-function of created classes,
but «after the dot», and not as an argument, which helps in the search for the function we need.

So, instead of the following:
```java 
public class ListUtils {
  public static int maxOf(List<Int> list) {...}
}

public class Main {
  public static main(String[] args) {
    List<Int> list = ...;
    System.out.println(ListUtils.maxOf(list));
  }
}
```
We have next variant that is much better:
```kotlin
fun List<Int>.max(): Int {...}

fun main() {
  val list = listOf(1, 3, 9)
  println(list.max())
}
```
Which has the following advantages:
- it is easier to search for functions that are needed for a specific type of data (there is no cluttering the namespace with other functions that we do not need)
- no need to have access to the actual class
- can be used with primitives

But what else can they be used for?

### Bypassing restrictions
Some things, such as inline functions cannot be overridden or initialized by inheritors (we cannot
use them as abstract members), because inline functions are final by definition. Therefore, usually, for example,
for reified, use the following hack:
```kotlin
interface Serializer {
  fun <T> encode(kClass: KClass<T>, value: T): String
}

inline fun <reified T> Serializer.encode(value: T): String {
  return encode(T::class, value)
}
```
That is, we understand that the inline function will not logically differ from its non-inline counterpart.
Also, it is I recommend doing it not only to bypass restrictions. And now I will explain why.

### Separate your own code
Although one of the advantages of extension functions is that you don't actually need to access the class, the extension function does
are also used to separate your code into main and support functions, for example:
```kotlin
class Storage(...) {
  fun getStringOrNull(key: String): String {...}
}

fun Storage.getString(key: String): String = 
  getStringOrNull() ?: throw NullPointerException("$key is null")
fun Storage.getStringOrDefault(key: String, defaultVal: String) = 
  getStringOrNull() ?: throw NullPointerException("$key is null")
```
So, by analogy with the previous example, we bring out functions that are not basic logic (without which the functionality of the
class does not change) separately after our class (this is a kind of code writing pattern formed in the community,
as it is also, for example, with factory-functions that we bring before the class).

You can view some examples from kotlinx.coroutines
[\[1\]](https://github.com/Kotlin/kotlinx.serialization/blob/master/core/commonMain/src/kotlinx/serialization/encoding/Decoding.kt#L561)
[\[2\]](https://github.com/Kotlin/kotlinx.serialization/blob/master/core/commonMain/src/kotlinx/serialization/encoding/Encoding.kt#L483)
or from ktor
[\[1\]](https://github.com/ktorio/ktor/blob/main/ktor-io/common/src/io/ktor/utils/io/ByteReadChannel.kt#L201)
[\[2\]](https://github.com/ktorio/ktor/blob/main/ktor-io/common/src/io/ktor/utils/io/core/Packet.kt#L15).
You can browse these repositories or any other repositories yourself and you will most likely find this approach.

## Conclusion
We use extension functions for many reasons: Technical limitations (such as: unavailability of actual class
or not being able to use some functionality like inline functions) and/or to split our code for
greater understanding.

You shouldn't engage in over-engineering, but you shouldn't ignore similar approaches either!

