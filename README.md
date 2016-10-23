1. This project is for CapitalOne Invest coding test.
2. Only two node modules are needed: moment and request. Their dependency modules are already downloaded in the repo. If something is wrong after cloning the repo, run 'npm install' to add these two modules.
3. Run 'node level-money' to count all transactions.
4. Run 'node level-money --ignore-donuts' to ignore donut-related transactions.
5. If any problem happens, shoot email to sqingyang@gmail.com please.
6. Since this is a coding test project, I ignore these parts in usual node code: (1) error handling. Suppose correct JSON data is received from remote endpoint. (2) logging. (3) validation of data. (4) unit test.
7. Although moment module is used for handling date-related aggregation, a much more natural, efficient way to handle time-range search and query lies on DB, e.g. MongoDB. Time query is pretty fancy in Mongo if data can be stored there persistently and later on used for query with optimization for indexing.
