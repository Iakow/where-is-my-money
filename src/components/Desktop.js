import { Header } from "./Header";
import { Container } from "@material-ui/core";
import { Stats } from "./Stats/Stats";

export function Desktop({ openTransactionForm }) {
  return (
    <>
      <Header openTransactionForm={openTransactionForm} />
      <Container maxWidth="lg">
        <Stats openTransactionForm={openTransactionForm} />
      </Container>
    </>
  );
}
