---
title: 'The new Code Crafter package for Python AST transformations'
date: 2024-03-31
permalink: /posts/2024-03-31-code-crafter
tags:
- python
---

I built a new tool! [Code crafter](https://github.com/bendichter/code-crafter) is a Python library designed for manipulating Python source code through Abstract Syntax Tree (AST) transformations. This tool simplifies the process of programmatically editing Python code, allowing developers to find and modify specific data structures such as lists, dictionaries, and sets within their code.

## Basic Usage

Starting with a file named `my_file.py` that contains the following code:

```python
my_list = [1, 2, 3]
my_dict = {"key1": "value1", "key2": "value2"}
my_set = {1, 2, 3}
```

You can use `code_crafter` to append an element to a list, add a new key-value pair to a dictionary, and add a new element to a set:

```python

import code_crafter as cc

# Automatically apply changes to 'my_file.py'
with cc.File("my_file.py") as file:
    # Append an element to a list named 'my_list'
    file.find_list("my_list").append(4)
    # Add a new key-value pair to a dictionary named 'my_dict'
    file.find_dict("my_dict").update(my_new_key="my_new_value")
    # Add a new element to a set named 'my_set'
    file.find_set("my_set").add(42)
```

After running the above code, the file `my_file.py` will be updated to:

```python
my_list = [1, 2, 3, 4]
my_dict = {"key1": "value1", "key2": "value2", "my_new_key": "my_new_value"}
my_set = {1, 2, 3, 42}
```

Most of the methods available for `cc.List`, `cc.Dict`, and `cc.Set` are similar to the methods available for the built-in Python data structures. For example,

`cc.List` supports the following methods:
* append
* extend
* insert
* remove
* pop
* clear
* reverse

`cc.Dict` supports the following methods:
* update
* clear
* pop
* get

`cc.Set` supports the following methods:
* add
* remove
* update
* discard

These transformations also work for code that contains calls to `list()`, `dict()`, and `set()` constructors.


## How it works
`code_crafter` uses the `ast` module to parse Python code into an Abstract Syntax Tree (AST). The AST is then traversed to find and modify the desired data structures. Finally, the modified AST is converted back into Python code. Because the code is entirely generated from the AST, no formatting is preserved. Code can be rendered either according to the default Python AST formatting or using the `black` code formatter.

This tool is useful for developers who need to programmatically edit Python code, such as when writing code generators or refactoring tools. Check it out on GitHub [here](https://github.com/bendichter/code-crafter).

