/* eslint-disable react/jsx-key */
import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";

import { useDispatch } from "react-redux";
import {
  addCommentBookAction,
  getAllBookAction,
  downloadsCountAction,
} from "../Redux/Action/bookAction";
import RatingComponent from "./rate";
import CommentSection from "./commentSection";
import DownloadButton from "./DownloadButton";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";
import { currentUserAction } from "../Redux/Action/userAction";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
const BookDetailPage = () => {
  const { id: bookId } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllBookAction());
    dispatch(currentUserAction());
  }, [dispatch]);

  const bookToPreview = useSelector((state) =>
    state.book.books.find((book) => book._id === bookId)
  );
  const [comment, setComment] = useState("");
  const handleRatingChange = (newRating) => {};

  const handleDownloadClick = () => {
    dispatch(downloadsCountAction({ bookId: bookToPreview._id }))
      .unwrap()
      .then(() => {
        window.open(
          `http://localhost:4000/uploads/${bookToPreview.file}`,
          "_blank"
        );
      });
  };

  const handleCommentSubmit = async (Comment) => {
    dispatch(
      addCommentBookAction({ bookId: bookToPreview?._id, comment: Comment })
    )
      .unwrap()
      .then(() => {
        dispatch(getAllBookAction());
        setComment("");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };
  const { t } = useTranslation();
  const coverImage = `http://localhost:4000/uploads/${bookToPreview?.coverImage}`;
  const formatTimeAgo = (createdAt) => {
    const now = moment();
    const commentTime = moment(createdAt);
    const diffInSeconds = now.diff(commentTime, "seconds");

    if (diffInSeconds < 60) {
      return t("timeAgo.now");
    } else if (diffInSeconds < 60 * 60) {
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      return t("timeAgo.minutesAgo", { count: diffInMinutes });
    } else if (diffInSeconds < 24 * 60 * 60) {
      const diffInHours = Math.floor(diffInSeconds / (60 * 60));
      return t("timeAgo.hoursAgo", { count: diffInHours });
    } else if (diffInSeconds < 24 * 60 * 30 * 60) {
      const diffInDays = Math.floor(diffInSeconds / (24 * 60 * 60));
      return t("timeAgo.daysAgo", { count: diffInDays });
    } else if (diffInSeconds < 24 * 60 * 30 * 12 * 60) {
      const diffInMonths = Math.floor(diffInSeconds / (24 * 60 * 30 * 60));
      return t("timeAgo.monthsAgo", { count: diffInMonths });
    } else {
      const diffInYears = Math.floor(diffInSeconds / (24 * 60 * 30 * 12 * 60));
      return t("timeAgo.yearsAgo", { count: diffInYears });
    }
  };
  return (
    <Container dir={i18n.dir()}>
      <Row className="mt-5">
        <Col lg={6} md={12}>
          {bookToPreview ? (
            <>
              <h2>{bookToPreview.title}</h2>
              <img
                src={coverImage}
                alt={bookToPreview.title}
                className="img-fluid mb-3"
              />
              <p>{bookToPreview?.description}</p>
              <p>
                {t("bookPreview.author")}: {bookToPreview?.author}
              </p>
              <p>
                {t("bookPreview.downloads")}: {bookToPreview?.downloads}
              </p>

              <h4>{t("bookPreview.bookRating")}</h4>
              <RatingComponent
                edit={false}
                initialRating={bookToPreview?.rate}
                onRatingChange={handleRatingChange}
              />
              <h4 className="mt-4">{t("bookPreview.downloadBook")}</h4>
              <DownloadButton onDownloadClick={handleDownloadClick} />
              {currentUser && (
                <>
                  <h4 className="mt-4">{t("bookPreview.readerComments")}</h4>
                  <CommentSection
                    comment={comment}
                    buttonText={t("bookPreview.addComment")}
                    placeholder={t("bookPreview.commentPlaceholder")}
                    onCommentChange={(e) => setComment(e.target.value)}
                    onCommentSubmit={handleCommentSubmit}
                  />
                </>
              )}
            </>
          ) : (
            <p>{t("bookPreview.bookNotSelected")}</p>
          )}
        </Col>

        <Col lg={6} md={12}>
          {bookToPreview ? (
            <>
              <h4 className="mt-4">{t("bookPreview.readerComments")}</h4>
              {bookToPreview.reviews.length > 0 ? (
                <>
                  {bookToPreview.reviews
                    .filter((review) => review.text !== undefined)
                    .map((review, index) => (
                      <div key={index} className="mb-3 border p-3 rounded">
                        <span className="text-muted mb-2 d-flex justify-content-between">
                          <strong>
                            <p>
                              {review.user.firstName} {review.user.lastName}
                            </p>
                          </strong>{" "}
                          &bull; {formatTimeAgo(review.createdAt)}
                        </span>
                        <p className="mb-0">{review.text}</p>
                      </div>
                    ))}
                </>
              ) : (
                <p>{t("bookPreview.noReviews")}</p>
              )}
            </>
          ) : (
            <p>{t("bookPreview.bookNotSelected")}</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default BookDetailPage;
