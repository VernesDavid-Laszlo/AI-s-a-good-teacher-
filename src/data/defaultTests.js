export const defaultTests = {
    binarySearchTests: [
        {
            title: "Binary Search Quiz 1 (Easy)",
            questions: [
                {
                    questionText: "What is the time complexity of binary search in the worst case?",
                    answers: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
                    correctAnswerIndex: 1,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Binary search works only on which type of array?",
                    answers: ["Unsorted", "Sorted", "Reverse sorted", "Empty"],
                    correctAnswerIndex: 1,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "What is returned if the target is not found in binary search?",
                    answers: ["0", "-1", "null", "undefined"],
                    correctAnswerIndex: 1,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Which technique is used by binary search?",
                    answers: ["Divide and conquer", "Dynamic programming", "Greedy", "Backtracking"],
                    correctAnswerIndex: 0,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "What is the best case time complexity of binary search?",
                    answers: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
                    correctAnswerIndex: 0,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "In which programming structure is binary search typically implemented?",
                    answers: ["If-else", "Loop", "Recursion", "Both recursion and loop"],
                    correctAnswerIndex: 3,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Binary search reduces the search space by:",
                    answers: ["1", "half", "quarter", "double"],
                    correctAnswerIndex: 1,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "What is the initial step in binary search?",
                    answers: ["Check first element", "Check last element", "Check middle element", "Sort the array"],
                    correctAnswerIndex: 2,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "If the middle element is less than the target, where do we search?",
                    answers: ["Left half", "Right half", "Both halves", "Stop search"],
                    correctAnswerIndex: 1,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "If the middle element is greater than the target, where do we search?",
                    answers: ["Left half", "Right half", "Both halves", "Stop search"],
                    correctAnswerIndex: 0,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                }
            ]
        },
        {
            title: "Binary Search Quiz 2 (Hard)",
            questions: [
                {
                    questionText: "Binary search has a space complexity of:",
                    answers: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
                    correctAnswerIndex: 0,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Which of the following causes binary search to fail?",
                    answers: ["Duplicate elements", "Unsorted array", "Large array", "Negative numbers"],
                    correctAnswerIndex: 1,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Binary search divides the array in each step by a factor of:",
                    answers: ["1", "2", "3", "4"],
                    correctAnswerIndex: 1,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "In binary search, how many comparisons in the worst case for 1024 elements?",
                    answers: ["10", "100", "512", "1024"],
                    correctAnswerIndex: 0,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Which programming paradigm fits binary search?",
                    answers: ["Greedy", "Divide and conquer", "Dynamic programming", "Branch and bound"],
                    correctAnswerIndex: 1,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Binary search is optimal on:",
                    answers: ["Small arrays", "Sorted arrays", "Unsorted arrays", "Linked lists"],
                    correctAnswerIndex: 1,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "How many elements are compared at each step of binary search?",
                    answers: ["1", "2", "3", "Depends on the array size"],
                    correctAnswerIndex: 0,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Is binary search stable?",
                    answers: ["Yes", "No", "Depends on implementation", "Not applicable"],
                    correctAnswerIndex: 3,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "How does binary search handle duplicate elements?",
                    answers: ["Always finds the first", "Always finds the last", "May find any occurrence", "Fails if duplicates present"],
                    correctAnswerIndex: 2,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "In recursive binary search, what happens after finding the target?",
                    answers: ["Continue searching", "Terminate recursion", "Search left side", "Search right side"],
                    correctAnswerIndex: 1,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                }
            ]
        }
    ],
    binarySearchTreeTests: [
        {
            title: "Binary Search Tree Quiz 1 (Easy)",
            questions: [
                {
                    questionText: "A Binary Search Tree (BST) is a type of:",
                    answers: ["Array", "Linked List", "Tree", "Graph"],
                    correctAnswerIndex: 2,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "In a BST, the left child of a node contains:",
                    answers: ["Greater value", "Smaller value", "Same value", "None of the above"],
                    correctAnswerIndex: 1,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "The right child of a node in BST contains:",
                    answers: ["Smaller value", "Equal value", "Greater value", "Negative value"],
                    correctAnswerIndex: 2,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "What is the average time complexity of searching in a BST?",
                    answers: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
                    correctAnswerIndex: 1,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "In the worst case, BST search has time complexity:",
                    answers: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
                    correctAnswerIndex: 2,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "What traversal returns BST elements in sorted order?",
                    answers: ["Preorder", "Postorder", "Inorder", "Level-order"],
                    correctAnswerIndex: 2,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "The height of a balanced BST is approximately:",
                    answers: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
                    correctAnswerIndex: 2,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Which operation is not commonly performed on a BST?",
                    answers: ["Search", "Insert", "Delete", "Hash"],
                    correctAnswerIndex: 3,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Which traversal is used to delete all nodes of a BST?",
                    answers: ["Inorder", "Preorder", "Postorder", "Level-order"],
                    correctAnswerIndex: 2,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Inserting elements in sorted order into a BST results in:",
                    answers: ["Balanced tree", "Linked list", "Heap", "Binary tree"],
                    correctAnswerIndex: 1,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                }
            ]
        },
        {
            title: "Binary Search Tree Quiz 2 (Hard)",
            questions: [
                {
                    questionText: "Which property of BST allows efficient searching?",
                    answers: ["Balanced height", "Unique keys", "Left < root < right property", "Complete nodes"],
                    correctAnswerIndex: 2,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Which is NOT a valid BST traversal?",
                    answers: ["Inorder", "Preorder", "Postorder", "Backward"],
                    correctAnswerIndex: 3,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "When deleting a node with two children in BST, we replace it with:",
                    answers: ["Leaf node", "Root node", "Inorder predecessor or successor", "Any random node"],
                    correctAnswerIndex: 2,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "A balanced BST ensures search complexity of:",
                    answers: ["O(n)", "O(n^2)", "O(log n)", "O(1)"],
                    correctAnswerIndex: 2,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Which traversal is used for copying a BST?",
                    answers: ["Inorder", "Preorder", "Postorder", "Level-order"],
                    correctAnswerIndex: 1,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "A degenerate BST resembles:",
                    answers: ["Balanced tree", "Linked list", "Complete binary tree", "Heap"],
                    correctAnswerIndex: 1,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "How many children can a node in BST have?",
                    answers: ["0", "1", "2", "0, 1, or 2"],
                    correctAnswerIndex: 3,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "If BST becomes unbalanced, what can be used to fix it?",
                    answers: ["Insertion", "Deletion", "Rotations", "Traversal"],
                    correctAnswerIndex: 2,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Which is a self-balancing BST?",
                    answers: ["Heap", "AVL tree", "Binary heap", "Hash table"],
                    correctAnswerIndex: 1,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "BST insert operation takes:",
                    answers: ["O(1)", "O(log n) avg", "O(n) worst", "Both B and C"],
                    correctAnswerIndex: 3,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                }
            ]
        }
    ],
    fibonacciSearchTests: [
        {
            title: "Fibonacci Search Quiz 1 (Easy)",
            questions: [
                {
                    questionText: "Fibonacci search works on which type of array?",
                    answers: ["Unsorted", "Sorted", "Reverse sorted", "Empty"],
                    correctAnswerIndex: 1,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Fibonacci search divides the array based on:",
                    answers: ["Binary values", "Golden ratio", "Fibonacci numbers", "Powers of 2"],
                    correctAnswerIndex: 2,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "What is the worst-case time complexity of Fibonacci search?",
                    answers: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
                    correctAnswerIndex: 1,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Fibonacci search is similar to:",
                    answers: ["Linear search", "Jump search", "Binary search", "Hashing"],
                    correctAnswerIndex: 2,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Which mathematical sequence is used in Fibonacci search?",
                    answers: ["Prime numbers", "Fibonacci sequence", "Factorials", "Arithmetic sequence"],
                    correctAnswerIndex: 1,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Fibonacci search is useful when:",
                    answers: ["Array size is unknown", "Random access is expensive", "Elements are linked", "Array is unsorted"],
                    correctAnswerIndex: 1,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Fibonacci search reduces the size of the search space by:",
                    answers: ["1", "2", "Fibonacci number", "Half"],
                    correctAnswerIndex: 2,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "What is the best case time complexity of Fibonacci search?",
                    answers: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
                    correctAnswerIndex: 0,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Fibonacci search is most similar in logic to:",
                    answers: ["Breadth-first search", "Depth-first search", "Binary search", "Jump search"],
                    correctAnswerIndex: 2,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "What is required before applying Fibonacci search?",
                    answers: ["Fibonacci numbers generation", "Hash table", "Linked list", "Unsorted array"],
                    correctAnswerIndex: 0,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                }
            ]
        },
        {
            title: "Fibonacci Search Quiz 2 (Hard)",
            questions: [
                {
                    questionText: "Which property makes Fibonacci search better than binary search on some machines?",
                    answers: ["Fewer instructions", "Better cache performance", "No recursion", "Uses hashing"],
                    correctAnswerIndex: 1,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "How many comparisons does Fibonacci search make per iteration?",
                    answers: ["1", "2", "3", "Variable"],
                    correctAnswerIndex: 1,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Which is a limitation of Fibonacci search?",
                    answers: ["Works only on arrays", "Cannot work on linked lists", "Needs Fibonacci sequence", "All of the above"],
                    correctAnswerIndex: 3,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Fibonacci search can be considered as a:",
                    answers: ["Divide and conquer algorithm", "Dynamic programming", "Greedy algorithm", "Recursive search"],
                    correctAnswerIndex: 0,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "What is the space complexity of Fibonacci search?",
                    answers: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
                    correctAnswerIndex: 0,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Fibonacci search precomputes:",
                    answers: ["Middle element", "Fibonacci numbers", "Prime numbers", "Hash function"],
                    correctAnswerIndex: 1,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Which data structure benefits most from Fibonacci search?",
                    answers: ["Array", "Hash table", "Linked list", "Tree"],
                    correctAnswerIndex: 0,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Fibonacci search is particularly efficient for:",
                    answers: ["Very large unsorted arrays", "Linked lists", "Sorted arrays in slow-access memory", "Unsorted lists"],
                    correctAnswerIndex: 2,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "What is the first step of Fibonacci search?",
                    answers: ["Find middle element", "Generate Fibonacci numbers", "Sort array", "Hash array"],
                    correctAnswerIndex: 1,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Fibonacci search reduces which kind of computation?",
                    answers: ["Recursion", "Arithmetic", "Division", "Multiplication"],
                    correctAnswerIndex: 2,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                }
            ]
        }
    ],
    intervalSearchTests: [
        {
            title: "Interval Search Quiz 1 (Easy)",
            questions: [
                {
                    questionText: "Interval search is used to find:",
                    answers: ["Single element", "Duplicate elements", "Elements in a range", "None"],
                    correctAnswerIndex: 2,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Which data structure can efficiently perform interval search?",
                    answers: ["Array", "Linked List", "Segment Tree", "Hash Map"],
                    correctAnswerIndex: 2,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Interval search can be used to:",
                    answers: ["Find minimum value", "Count elements in a range", "Sort array", "Find duplicates"],
                    correctAnswerIndex: 1,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Which algorithm can be used to implement interval search on a sorted array?",
                    answers: ["Binary Search", "Jump Search", "Fibonacci Search", "All of the above"],
                    correctAnswerIndex: 3,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "What is the time complexity of linear interval search?",
                    answers: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
                    correctAnswerIndex: 2,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Which query type is NOT an interval search?",
                    answers: ["Range minimum query", "Range sum query", "Exact match query", "Range count query"],
                    correctAnswerIndex: 2,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Which is a common use case of interval search?",
                    answers: ["Image compression", "Database filtering", "Memory management", "Graph traversal"],
                    correctAnswerIndex: 1,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "An interval is defined by:",
                    answers: ["One value", "Two values (lower and upper bound)", "Three values", "Four values"],
                    correctAnswerIndex: 1,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Interval search in a BST can be done using:",
                    answers: ["Inorder traversal", "Postorder traversal", "Preorder traversal", "Random traversal"],
                    correctAnswerIndex: 0,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "If the array is unsorted, interval search will have complexity:",
                    answers: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
                    correctAnswerIndex: 2,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                }
            ]
        },
        {
            title: "Interval Search Quiz 2 (Hard)",
            questions: [
                {
                    questionText: "What data structure allows interval insertion and deletion efficiently?",
                    answers: ["Hash table", "AVL tree", "Segment Tree", "Linked List"],
                    correctAnswerIndex: 2,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "In range minimum query, what do we find?",
                    answers: ["Maximum element", "Minimum element", "Sum of elements", "Number of elements"],
                    correctAnswerIndex: 1,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Which technique is used to optimize interval search?",
                    answers: ["Greedy", "Divide and conquer", "Dynamic programming", "Both B and C"],
                    correctAnswerIndex: 3,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "A segment tree stores:",
                    answers: ["Only leaf nodes", "Prefix sums", "Aggregated information per interval", "Exact matches only"],
                    correctAnswerIndex: 2,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "What is the space complexity of segment tree?",
                    answers: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
                    correctAnswerIndex: 0,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Which traversal is useful for range queries in BST?",
                    answers: ["Preorder", "Postorder", "Level-order", "Inorder"],
                    correctAnswerIndex: 3,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Interval search in an ordered set takes:",
                    answers: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
                    correctAnswerIndex: 2,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Which range query type aggregates values?",
                    answers: ["Range sum", "Exact match", "Prefix sum", "Suffix sum"],
                    correctAnswerIndex: 0,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Interval trees are based on which data structure?",
                    answers: ["Hash table", "AVL tree", "Heap", "Trie"],
                    correctAnswerIndex: 1,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "The optimal structure for dynamic interval search is:",
                    answers: ["Binary heap", "AVL tree", "Segment tree", "B-tree"],
                    correctAnswerIndex: 2,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                }
            ]
        }
    ],
    linearSearchTests: [
        {
            title: "Linear Search Quiz 1 (Easy)",
            questions: [
                {
                    questionText: "What is the time complexity of linear search in the worst case?",
                    answers: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
                    correctAnswerIndex: 2,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Linear search works on which type of array?",
                    answers: ["Sorted", "Unsorted", "Both sorted and unsorted", "Empty only"],
                    correctAnswerIndex: 2,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "What is the best case time complexity of linear search?",
                    answers: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
                    correctAnswerIndex: 0,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "What is returned if target is not found in linear search?",
                    answers: ["0", "-1", "null", "Infinity"],
                    correctAnswerIndex: 1,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Which loop is typically used in a linear search implementation?",
                    answers: ["for", "while", "do-while", "any of the above"],
                    correctAnswerIndex: 3,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "In linear search, elements are compared:",
                    answers: ["From middle", "From left to right", "From right to left", "Randomly"],
                    correctAnswerIndex: 1,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Linear search is also known as:",
                    answers: ["Sequential search", "Binary search", "Hash search", "Tree search"],
                    correctAnswerIndex: 0,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Linear search is useful when:",
                    answers: ["Data is sorted", "Data is unsorted", "Hash table is used", "Data is compressed"],
                    correctAnswerIndex: 1,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Which data structure supports linear search?",
                    answers: ["Array", "Linked List", "Both A and B", "Hash Table"],
                    correctAnswerIndex: 2,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "How many elements may need to be checked in worst case of linear search?",
                    answers: ["1", "n/2", "n", "log n"],
                    correctAnswerIndex: 2,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                }
            ]
        },
        {
            title: "Linear Search Quiz 2 (Hard)",
            questions: [
                {
                    questionText: "Linear search works best when:",
                    answers: ["Data is large", "Target is at beginning", "Target is at end", "Target does not exist"],
                    correctAnswerIndex: 1,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "What is the auxiliary space used by linear search?",
                    answers: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
                    correctAnswerIndex: 0,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "What type of search is linear search?",
                    answers: ["Divide and conquer", "Greedy", "Brute force", "Dynamic programming"],
                    correctAnswerIndex: 2,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Which statement about linear search is true?",
                    answers: ["It needs sorted array", "It works only for numbers", "It always finds first occurrence", "It uses recursion only"],
                    correctAnswerIndex: 2,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Linear search compares:",
                    answers: ["Hashes", "Direct memory", "Each element sequentially", "Sorted indices"],
                    correctAnswerIndex: 2,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "If there are duplicates, linear search will return:",
                    answers: ["Last occurrence", "Middle occurrence", "Any random occurrence", "First occurrence"],
                    correctAnswerIndex: 3,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "In which data structure is linear search less efficient?",
                    answers: ["Array", "Linked list", "Hash table", "List"],
                    correctAnswerIndex: 2,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "Which is NOT an advantage of linear search?",
                    answers: ["Simple to implement", "Works on unsorted data", "Optimal for large data", "No extra space required"],
                    correctAnswerIndex: 2,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "If the array is empty, linear search will:",
                    answers: ["Return first element", "Return last element", "Return -1", "Throw error"],
                    correctAnswerIndex: 2,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                },
                {
                    questionText: "How many comparisons does linear search make in best case?",
                    answers: ["1", "2", "n", "n/2"],
                    correctAnswerIndex: 0,
                    aiHelpUsed: false,
                    attemptCount: 0,
                    scoreGiven: 0
                }
            ]
        }
    ]
};
