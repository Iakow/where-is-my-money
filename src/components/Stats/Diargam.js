import React, { useState } from "react";
import {
  makeStyles,
  mergeClasses,
  Paper,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "space-around",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
      justifyContent: "start",
    },
  },
  legendContainer: {
    backgroundColor: "#0000002e",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
  },
  chartContainer: {
    height: "100%",
    width: "50%",

    [theme.breakpoints.down("xs")]: {
      height: "80vw",
      width: "100vw",
    },
  },
  legendContainer2: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    minWidth: 200,

    [theme.breakpoints.down("xs")]: {
      width: "60vw",
      alignSelf: "center",
    },
  },
}));
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
];

const COLORS2 = [
  "#003f5c",
  "#2f4b7c",
  "#665191",
  "#a05195",
  "#d45087",
  "#f95d6a",
  "#ff7c43",
  "#ffa600",
].reverse();

const COLORS3 = [
  "#00876c",
  "#3d9c73",
  "#63b179",
  "#88c580",
  "#aed987",
  "#d6ec91",
  "#ffff9d",
  "#fee17e",
  "#fcc267",
  "#f7a258",
  "#ef8250",
  "#e4604e",
  "#d43d51",
].reverse();

export function Diagram({ data }) {
  data.outcome.sort((a, b) => {
    if (a.sum > b.sum) return -1;
    if (a.sum < b.sum) return +1;
    return 0;
  });

  const classes = useStyles();
  const theme = useTheme();
  const isXS = useMediaQuery(theme.breakpoints.down("xs"), { noSsr: true });

  const [isIncome, setIsIncome] = useState(false);

  return (
    <div className={classes.container}>
      <div className={classes.chartContainer}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={isIncome ? data.income : data.outcome}
              dataKey="sum"
              nameKey="name"
              cx="50%"
              cy="50%"
              fill="#8884d8"
              animationDuration={800}
              animationBegin={30}
              // label
            >
              {data.outcome.map((category, i) => (
                <Cell
                  key={`cell-${i}`}
                  fill={COLORS3[i % COLORS3.length]}
                  stroke=""
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className={classes.legendContainer2}>
        <Paper className={classes.legendContainer}>
          <List dense={isXS}>
            {data.outcome.map(
              (cat, i) =>
                cat.sum !== 0 && (
                  <ListItem
                    key={cat.name}
                    className={classes.listItem}
                    style={{ color: COLORS3[i % COLORS3.length] }}
                    /* divider={!isXS} */
                  >
                    <span>{cat.name}</span>
                    <span>{cat.sum}</span>
                  </ListItem>
                )
            )}
          </List>
        </Paper>
      </div>
    </div>
  );
}
