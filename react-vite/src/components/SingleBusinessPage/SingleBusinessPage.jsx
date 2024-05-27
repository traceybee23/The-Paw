import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSingleBusiness } from "../../redux/businesses";
import { useEffect, useRef, useState } from "react";
import './SingleBusiness.css';
import BusinessDetails from "./BusinessDetails";
import BusinessContactCard from "./BusinessContactCard";
import AllPhotosModal from "../AllPhotosModal/AllPhotosModal";
import OpenModalButton from "../OpenModalButton";
import { getTodaysHours } from "../../utils";
// import { fetchGeocode } from '../../redux/maps';


function SingleBusinessPage() {
    const { businessId } = useParams();
    const dispatch = useDispatch();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

    const business = useSelector(state => (
        state.businesses[businessId]
    ))


    useEffect(() => {
        const runDispatches = async () => {
            dispatch(fetchSingleBusiness(businessId));
        };
        runDispatches();
    }, [dispatch, businessId])



    const handleResize = () => {
        setIsMobile(window.innerWidth <= 480);
    }

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize)
    }, []);

    const reviewStars = (numStars) => {
        let filled_paws = [];
        let unfilled_paws = []

        for (let i = 0; i < parseInt(numStars); i++) {
            filled_paws.push(<span className="paws-filled"><i className="fa-solid fa-paw"></i> </span>)
        }

        let remaining_paws = 5 - filled_paws.length

        for (let i = 0; i < remaining_paws; i++) {
            unfilled_paws.push(<span className="paws-unfilled"><i className="fa-solid fa-paw"></i> </span>)
        }

        return [filled_paws, unfilled_paws]
    }

    const totalImages = (businessImages, reviewImages) => {
        if (businessImages && reviewImages) {
            return businessImages.length + reviewImages.length;
        }
        else if (businessImages && !reviewImages) {
            return businessImages.length;
        }
        else if (reviewImages && !businessImages) {
            return reviewImages;
        }
    }

    const reviewAvg = (avg) => {
        if (avg !== null) {
            return avg.toFixed(1);
        } else {
            return avg
        }
    }

    const locationHoursSection = useRef(null)

    const scrollTo = (section) => {
        window.scrollTo({
            top: section.current.offsetTop,
            behavior: "smooth",
        });
    };




    return (business && business.business_images &&
        <>
            <div className="businessPhotoHeader">
                {business.business_images?.[0] ? (
                    <img src={business.business_images?.[0]?.image_url
                    } />
                ) : (
                    <img src='../../images/default_business.jpeg' />
                )}

                <div className="businessHeader">
                    <div>
                        <h1>{business.name}</h1>

                        {business.reviews?.num_reviews === 0 &&
                            <p className="businessReviews_first">
                                <span className="paws-unfilled"><i className="fa-solid fa-paw" /></span>&nbsp; Be the first to review!
                            </p>
                        }
                        {business.reviews?.num_reviews > 1 &&
                            <p className="businessReviews">
                                <span className="pawBlock">
                                    {business.reviews.avg_stars &&
                                        reviewStars(business.reviews.avg_stars)}</span>
                                &nbsp;&nbsp; {business.reviews.avg_stars && reviewAvg(business.reviews.avg_stars)}
                                &nbsp;({business.reviews.num_reviews} reviews)
                            </p>
                        }
                        {business.reviews?.num_reviews === 1 &&
                            <p className="businessReviews">
                                <span className="pawBlock">
                                    {business.reviews.avg_stars &&
                                        reviewStars(business.reviews.avg_stars)}</span>
                                &nbsp;&nbsp; {business.reviews.avg_stars && reviewAvg(business.reviews.avg_stars)}
                                &nbsp;({business.reviews.num_reviews} review)
                            </p>
                        }

                        {!business.price ? (

                            <p className="priceSubcat">{business.category?.name}
                            </p>
                        ) : (
                            <p className="priceSubcat">{business.price} &nbsp;&#183;&nbsp; {business.category?.name}
                            </p>
                        )
                        }

                        <div className="currHours">
                            {business.set_hours === "yes" && getTodaysHours(business) &&
                                <span className="currHoursSection">
                                    <span>
                                        <span style={{
                                            color: "#0BDA51"
                                        }}>Open Today&nbsp;&nbsp;</span>{getTodaysHours(business).open} - {getTodaysHours(business).close}&nbsp;&nbsp;
                                    </span>
                                    <span className="seeHours" onClick={() => scrollTo(locationHoursSection)}>See hours</span>
                                </span>
                            }
                            {business.set_hours === "yes" && !getTodaysHours(business) &&
                                <span className="currHoursSection">
                                    <span style={{
                                        color: "#FF474C"
                                    }}>Closed Today&nbsp;</span> <span className="seeHours" onClick={() => scrollTo(locationHoursSection)}>See hours</span>
                                </span>
                            }

                        </div>
                    </div>
                    <div className="seeAllPhotosSection">
                        <div className="seeAllPhotos">
                            {business.business_images && totalImages(business.business_images, business.review_images) === 1 ? (
                                <OpenModalButton
                                    buttonText="See 1 photo"
                                    modalComponent={<AllPhotosModal businessId={businessId} modalLoad={true} />}
                                />
                            ) : (<OpenModalButton
                                buttonText={`See all ${totalImages(business.business_images, business.review_images)} photos`}
                                modalComponent={<AllPhotosModal businessId={businessId} modalLoad={true} />}
                            />)
                            }
                        </div>
                    </div>
                </div>
            </div >
            <div className="businessContainer">
                <BusinessDetails business={business} businessId={businessId} locationHoursSection={locationHoursSection} isMobile={isMobile} />
                {!isMobile && <BusinessContactCard business={business} isMobile={isMobile} />
                }
            </div>
        </>
    )
}

export default SingleBusinessPage
