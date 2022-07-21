import base64

from django.test import TestCase

import pickle


class Solution:
    def strStr(self, haystack: str, needle: str) -> int:
        if needle == "":
            return 0

        i = 0
        while (i <= (len(haystack) - len(needle))):
            if haystack[i:i + len(needle)] == needle:
                return i

            i += 1

        return -1
a = Solution().strStr("mississippi","pi")
print(a)