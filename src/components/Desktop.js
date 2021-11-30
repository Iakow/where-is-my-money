import { Header } from "./Header";
import { Container } from "@material-ui/core";
import { Stats } from "./Stats/Stats";

export function Desktop({userData, openTransactionForm}) {
  return (
    <>
      <Header userData={userData} openTransactionForm={openTransactionForm} />
      <Container maxWidth="lg">
        <Stats userData={userData} openTransactionForm={openTransactionForm} />
      </Container>
    </>
  );
}
