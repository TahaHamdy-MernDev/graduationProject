import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import uploadImage from "../images/upload.png";
import { useDispatch } from "react-redux";
// import { editCourseAction } from "../Redux/Action/courseAction";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAllCategoriesAction } from "../Redux/Action/categoryAction";
import { updateCourseByIdAction } from "../Redux/Action/courseAction";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

function EditCourse() {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories } = useSelector((state) => state.category);
  const [coverImage, setCoverImage] = useState(null);
  const [whatYouWillLearn, setWhatYouWillLearn] = useState([""]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const courseToEdit = useSelector((state) =>
    state.course.courses.find((course) => course._id === id)
  );
  useEffect(() => {
    dispatch(getAllCategoriesAction());
    const fetchCourseData = async () => {
      try {
        setValue("name", courseToEdit.name);
        setValue("instructor", courseToEdit.instructor);
        setValue("price", courseToEdit.price);
        setValue("category", courseToEdit.category._id);
        setValue("description", courseToEdit.description);
        setWhatYouWillLearn(courseToEdit.whatUWillLearn);
        // Set other form fields as needed
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchCourseData();
  }, [
    courseToEdit.category._id,
    courseToEdit.description,
    courseToEdit.instructor,
    courseToEdit.name,
    courseToEdit.price,
    courseToEdit.whatUWillLearn,
    dispatch,
    id,
    setValue,
  ]);

  const handleAddLearnPoint = () => {
    setWhatYouWillLearn([...whatYouWillLearn, ""]);
  };
  const coverImageUrl = `http://localhost:4000/uploads/${courseToEdit?.image}`;
  const handleLearnPointChange = (index, value) => {
    const updatedPoints = [...whatYouWillLearn];
    updatedPoints[index] = value;
    setWhatYouWillLearn(updatedPoints);
  };

  const handleRemoveLearnPoint = (index) => {
    const updatedPoints = [...whatYouWillLearn];
    updatedPoints.splice(index, 1);
    setWhatYouWillLearn(updatedPoints);
  };

  const onDropCoverImage = (acceptedFiles) => {
    setCoverImage(acceptedFiles[0]);
  };

  const {
    getRootProps: getRootCoverImageProps,
    getInputProps: getInputCoverImageProps,
  } = useDropzone({
    onDrop: onDropCoverImage,
    accept: "image/*",
  });

  const onSubmit = (data) => {
    data = { ...data, whatUWillLearn: whatYouWillLearn, image: coverImage };
  if (data.coverImage === null) {
      delete data.coverImage;
    }
    // Dispatch the editCourseAction with the edited data
    dispatch(updateCourseByIdAction({ _id: id, courseData: data }))
      .unwrap()
      .then(() => {
        toast.success("تم تعديل الدورة بنجاح");
        navigate("/admin-course");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <Container dir={i18n.dir()}>
      <Form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="mt-2 mb-2">{t('editCourse.editCourse')}</h2>
        <Row className="justify-content-start">
          <Col lg={6} md={12}>
            <Form.Group controlId="courseName" className="mb-2">
              <Form.Label>{t('editCourse.courseName')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('editCourse.courseName')}
                {...register("name", { required: true })}
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
              />
            </Form.Group>
            <Form.Group controlId="instructor" className="mb-2">
              <Form.Label> {t('editCourse.instructor')}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t('editCourse.instructor')}
                {...register("instructor", { required: true })}
                className={`form-control ${
                  errors.instructor ? "is-invalid" : ""
                }`}
              />
            </Form.Group>

            <Form.Group controlId="coursePrice" className="mb-2">
              <Form.Label>{t('editCourse.coursePrice')}</Form.Label>
              <Form.Control
                type="number"
                placeholder={t('editCourse.coursePrice')}
                {...register("price", { required: true })}
                className={`form-control ${errors.price ? "is-invalid" : ""}`}
              />
            </Form.Group>
            <Form.Group controlId="formCategory" className="mb-2">
              <Form.Label>{t('editCourse.selectCategory')}</Form.Label>
              <Form.Control
                as="select"
                name="category"
                {...register("category", { required: true })}
                className={`form-control ${
                  errors.category ? "is-invalid" : ""
                }`}
              >
                <option value="" disabled>
                {t('editCourse.selectCategory')}
                </option>
                {categories.map((category, index) => (
                  <option key={index} value={category._id}>
                    {category.categoryName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="courseDescription" className="mb-2">
              <Form.Label>{t('editCourse.courseDescription')}</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder={t('editCourse.courseDescription')}
                {...register("description", { required: true })}
                className={`form-control ${
                  errors.description ? "is-invalid" : ""
                }`}
              />
            </Form.Group>
          </Col>
          <Col lg={6} md={12}>
            <Form.Group controlId="whatYouWillLearn" className="mb-2">
              <Form.Label>{t('editCourse.whatYouWillLearn')}</Form.Label>
              {whatYouWillLearn.map((point, index) => (
                <div key={index} className="d-flex mb-2 gap-2">
                  <Form.Control
                    type="text"
                    placeholder={`النقطة ${index + 1}`}
                    value={point}
                    onChange={(e) =>
                      handleLearnPointChange(index, e.target.value)
                    }
                    className="me-2"
                  />
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveLearnPoint(index)}
                  >
                    {t('editCourse.removeLearnPoint')}
                  </Button>
                </div>
              ))}
              <Button
                variant="primary"
                className="mt-2"
                onClick={handleAddLearnPoint}
              >
              {t('editCourse.addLearnPoint')}
              </Button>
            </Form.Group>
            <Form.Group controlId="formCoverImage" className="mb-4">
              <Form.Label> {t('editCourse.coverImage')}</Form.Label>
              <div
                {...getRootCoverImageProps()}
                className="dropzone border rounded p-3 cursor-pointer"
              >
                <input {...getInputCoverImageProps()} />
                {coverImage ? (
                  <Image
                    src={URL.createObjectURL(coverImage)}
                    alt="Cover Image Preview"
                    fluid
                    className="mb-3"
                  />
                ) : (
                  <Image
                    src={coverImageUrl}
                    alt="Placeholder Image"
                    fluid
                    className="mb-3"
                  />
                )}
                <p className="text-muted small">
                {t('editCourse.dropzoneText')}
                </p>
              </div>
              {errors.coverImage && (
                <p className="text-danger mt-1">{errors.coverImage.message}</p>
              )}
            </Form.Group>
          </Col>
          <Row>
            <Col>
              <Button variant="primary" type="submit">
              {t('editCourse.editCourseButton')}
              </Button>
            </Col>
          </Row>
        </Row>
      </Form>
    </Container>
  );
}

export default EditCourse;
