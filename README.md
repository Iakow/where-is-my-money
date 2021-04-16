# where-is-my-money
Study project within the front-end course from Kottans

The application is designed to track income & expenses. It should help you better control expenses, plan a budget and, possibly, get insights from statistics. It should answer questions like:
- How much money do I have now?
- How long have I bought Chinese sneakers that have just died?
- How much money did I spend on damn cigarettes in a year?
- If I buy that guitar there now, how hard will it be for me to live up to my paycheck?


I will use a simple custom REST API running on Firebase that allows now:
1. Authentication
2. CRUD operations on transactions of the type {sum, date, category, comment}
3. Get a list of available expense categories


Main features:
1. add / edit / delete transactions of the specified format
2. show a list of transactions
3. show current balance (at registration, you need to answer the question how much money do you have 😎)
4. some sorting and filtering in the list of transactions + sum for the entire sample
5. show the distribution of costs by category for the specified period (as a list)
6. visualization of the mentioned distribution
7. plan and track your budget until your next payday (some widget displays balance changes and the passage of time)
8. user tags for transactions and custom categories
9. the application can work offline
