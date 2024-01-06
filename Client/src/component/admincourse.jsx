
import { Container, Row, Button } from "react-bootstrap";
// import BookTable from "./booksTable";
import { Link } from "react-router-dom";
import CourseTable from "./coursesTable";
import { useTranslation } from "react-i18next";

function AdminCourse() {
  const { t } = useTranslation();
  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>{t('manageCourses.title')}</h2>
          <Link to="/create-course">
    
            <Button className="btn btn-primary">{t('addCourse.addNewCourse')}</Button>
          </Link>
        </div>
      </Row>

      <Row>
     
          <CourseTable />
      </Row>
    </Container>
  );
}

export default AdminCourse;
