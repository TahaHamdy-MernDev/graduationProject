import { Container, Row, Col, Button } from "react-bootstrap";
import BookTable from "./booksTable";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function AdminPage() {
  const { t } = useTranslation();
  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{t('manageBooks.title')}</h2>
          <Link to="/create-book">
            <Button className="btn btn-primary">{t('addBookForm.addNewBook')}</Button>
          </Link>
        </div>
      </Row>

      <Row>
        <Col>
          <BookTable />
        </Col>
      </Row>
    </Container>
  );
}

export default AdminPage;
