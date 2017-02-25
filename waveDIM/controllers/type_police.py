#!/usr/bin/python3
import inspect
from functools import wraps

__author__ = "Sander Ferdinand"
__credits__ = "Joe Jevnik"
__date__ = 2017


def type_police(f):
    """
    Decorator for checking annotated type hints
    at runtime. Verifies input and output. Raises
    TypeError on conflict.
    """
    signature = inspect.signature(f)

    @wraps(f)
    def wrapped(*args, **kwargs):
        annotation_args = {k: v for k, v in f.__annotations__.items()
                           if not k == "return"}
        bound_args = signature.bind(*args, **kwargs).arguments
        for name, type_ in annotation_args.items():
            if not isinstance(bound_args[name], type_):
                raise TypeError('function %s argument \'%s\' must be of type \'%s\'' % (
                    f.__qualname__, str(name), str(type_.__qualname__)))
        rtn = f(*args, **kwargs)
        if "return" in f.__annotations__:
            if not isinstance(rtn, f.__annotations__["return"]):
                raise TypeError("function %s returned type \'%s\' while \'%s\' is required" % (
                    f.__qualname__, type(rtn).__qualname__,
                    f.__annotations__["return"].__qualname__))
        return rtn
    return wrapped
