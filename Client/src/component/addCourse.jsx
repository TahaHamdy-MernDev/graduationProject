import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import uploadImage from "../images/upload.png";
import { useDispatch } from "react-redux";
import { createCourseAction } from "../Redux/Action/courseAction";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAllCategoriesAction } from "../Redux/Action/categoryAction";
import i18n from "../i18n";
import { useTranslation } from "react-i18next";
function AddCourse() {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [whatYouWillLearn, setWhatYouWillLearn] = useState([""]);

  const handleAddLearnPoint = () => {
    setWhatYouWillLearn([...whatYouWillLearn, ""]);
  };

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
  const [coverImage, setCoverImage] = React.useState(null);
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories } = useSelector((state) => state.category);
  useEffect(() => {
    dispatch(getAllCategoriesAction());
  }, [dispatch]);
  const onSubmit = (data) => {
    if (!coverImage) {
      return toast.error("يرجى اضافة صوره للدوره");
    }
   
    data = { ...data, whatUWillLearn: whatYouWillLearn, image: coverImage };

    dispatch(createCourseAction(data))
      .unwrap()
      .then(() => {
        toast.success("تم انشاء الدوره بنجاح");
        navigate("/admin-course");
      })
      .catch((err) => {
  
        toast.error(err.message);
      });
  };
  return (
    <Container dir={i18n.dir()}>
    <Form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="mt-2 mb-2">{t('addCourse.addNewCourse')}</h2>
      <Row className="justify-content-start">
        <Col lg={6} md={12}>
          <Form.Group controlId="courseName" className="mb-2">
            <Form.Label>{t('addCourse.courseName')}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t('addCourse.courseName')}
              {...register("name", { required: true })}
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
            />
          </Form.Group>
          <Form.Group controlId="courseDescription" className="mb-2">
            <Form.Label>{t('addCourse.courseDescription')}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t('addCourse.courseDescription')}
              {...register("subDescription", { required: true })}
              className={`form-control ${errors.subDescription ? "is-invalid" : ""}`}
            />
          </Form.Group>
          <Form.Group controlId="instructor" className="mb-2">
            <Form.Label>{t('addCourse.instructor')}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t('addCourse.instructor')}
              {...register("instructor", { required: true })}
              className={`form-control ${errors.instructor ? "is-invalid" : ""}`}
            />
          </Form.Group>

          <Form.Group controlId="coursePrice" className="mb-2">
            <Form.Label>{t('addCourse.coursePrice')}</Form.Label>
            <Form.Control
              type="number"
              placeholder={t('addCourse.coursePrice')}
              {...register("price", { required: true })}
              className={`form-control ${errors.price ? "is-invalid" : ""}`}
            />
          </Form.Group>
          <Form.Group controlId="formCategory" className="mb-2">
            <Form.Label>{t('addCourse.selectCategory')}</Form.Label>
            <Form.Control
              as="select"
              name="category"
              {...register("category", { required: true })}
              className={`form-control ${
                errors.category ? "is-invalid" : ""
              }`}
            >
              <option value="" disabled>
                {t('addCourse.selectCategory')}
              </option>
              {categories.map((category, index) => (
                <option key={index} value={category._id}>
                  {category.categoryName}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="courseDescription" className="mb-2">
            <Form.Label>{t('addCourse.courseDescription')}</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder={t('addCourse.courseDescription')}
              {...register("description", { required: true })}
              className={`form-control ${
                errors.description ? "is-invalid" : ""
              }`}
            />
          </Form.Group>
        </Col>
        <Col lg={6} md={12}>
          <Form.Group controlId="whatYouWillLearn" className="mb-2">
            <Form.Label>{t('addCourse.whatYouWillLearn')}</Form.Label>
            {whatYouWillLearn.map((point, index) => (
              <div key={index} className="d-flex mb-2 gap-2">
                <Form.Control
                  type="text"
                  placeholder={`${t('addCourse.whatYouWillLearn')} ${index + 1}`}
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
                  {t('addCourse.removeLearnPoint')}
                </Button>
              </div>
            ))}
            <Button
              variant="primary"
              className="mt-2"
              onClick={handleAddLearnPoint}
            >
              {t('addCourse.addLearnPoint')}
            </Button>
          </Form.Group>
          <Form.Group controlId="formCoverImage" className="mb-4">
            <Form.Label>{t('addCourse.coverImage')}</Form.Label>
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
                  src={uploadImage}
                  alt="Placeholder Image"
                  fluid
                  className="mb-3"
                />
              )}
              <p className="text-muted small">
                {t('addCourse.dropzoneText')}
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
              {t('addCourse.addCourseButton')}
            </Button>
          </Col>
        </Row>
      </Row>
    </Form>
  </Container>
  );
}

export default AddCourse;
