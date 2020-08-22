## Run Instructions

#### Tests

```bash
npm run test
```

#### Main

```bash
npm run main
```

#### Files

| File  | Description  |
|---|---|
| README.md | Describe my thought processes while tackling this programming task | 
| log-analysis.js | library file containing the code that does the analysis |
| package.json | supply handy way to run tests and run the main script |
| main.js | script that processed the given log file and prints out the results from analysis  |
| test.js | script the runs the tests for the main script |
| | |
## Thoughts before I got started

I decided to implement the solution using Javascript, for no particular reason, other than I felt like writing some Javascript.

I used regular expressions to define the parsing of the data, making them constants at the top of the library for easy editing and testing.

Due to the sort of script this is, I chose to refrain adding dependencies, so it could run stand alone.

I time boxed the project to 2 hours, to add some design scope, and as to not over engineer the solution. The brief advised 1.5 hours.

I decided to use Mocha as the test framework, because it did what I needed.

## Initial Investigation

Before starting, I set out to understand the data that I am parsing, using bash commands.

### Get unique list of IPs,

```bash
cat programming-task-example-data.log |awk '{print $1}' |sort |uniq -c |sort -rn
```

```text
4 168.41.191.40
3 72.44.32.10
3 50.112.00.11
3 177.71.128.21
2 168.41.191.9
2 168.41.191.43
2 168.41.191.34
1 79.125.00.21
1 72.44.32.11
1 50.112.00.28
1 168.41.191.41
```

### Get unique list of URLs

  - strip the URL after a ? to remove URL parameters
  - may need to strip the leading protocol, site name and port number, if that level of URL detail is not required.
  - noting that there are no duplicates, at this point suggests that I also need to strip out host name.
  - final thought, looking at count values, there does not seem to be a distinct top three list.

```bash
cat programming-task-example-data.log |awk -F'"' '{print $2}' |awk '{print $2}' |sed 's/http:\/\/[A-z.-]*\//\//g' |sort |uniq -c |sort -rn
```

```text
2 /faq/
2 /docs/manage-websites/
1 /translations/
1 /to-an-error
1 /this/page/does/not/exist/
1 /temp-redirect
1 /newsletter/
1 /moved-permanently
1 /intranet-analytics/
1 /hosting/
1 /faq/how-to/
1 /faq/how-to-install/
1 /download/counter/
1 /docs/manage-users/
1 /docs/
1 /blog/category/meta/
1 /blog/category/community/
1 /blog/2018/08/survey-your-opinion-matters/
1 /asset.js
1 /asset.css
1 /
```

## Analysis Results

I noted that when listing IPs and URLs, in order of number of instances,
there are multiple which have the same count. This will mean the top 3
lists may change, depending on the processing technique.

#### The number of unique IP addresses

```bash
cat programming-task-example-data.log |awk '{print $1}' |sort |uniq |wc -l
```

```text
11
```

#### The top 3 most visited URLs

```bash
cat programming-task-example-data.log |awk -F'"' '{print $2}' |awk '{print $2}' |sed 's/http:\/\/[A-z.-]*\//\//g' |sort |uniq -c |sort -rn |head -3 |awk '{print $2}'
```

```text
/faq/
/docs/manage-websites/
/translations/
```

#### The top 3 most active IP addresses

```bash
cat programming-task-example-data.log |awk '{print $1}' |sort |uniq -c |sort -rn |head -3 |awk '{print $2}'
```

```text
168.41.191.40
72.44.32.10
50.112.00.11
```

## Results from the LogAnalysis library

```bash
Unique IP List:  177.71.128.21, 168.41.191.40, 168.41.191.41, 168.41.191.9, 168.41.191.34, 50.112.00.28, 50.112.00.11, 72.44.32.11, 72.44.32.10, 168.41.191.43, 79.125.00.21
     Top 3 IPs:  168.41.191.40, 177.71.128.21, 50.112.00.11
    Top 3 URLs:  /faq/, /docs/manage-websites/, /intranet-analytics/
```

### Final Thoughts

The following are thoughts regarding the difference I got between the Bash commands and the LogAnalyser library.

- There Unique IP list was the same, which was not surprising if my RegEx was tested properly.
- The top three IP numbers were the same for the first 2, but differed because there are multiple 3rd ranking.
  - I would suggest that the bash script sort, and the Javascript hash and then sort, have ended up with different orders.
- The top tree URLs also have a different third item with the bash commands, and I suggest that this is also due to what happened with the IP top three.