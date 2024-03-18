from flask import Blueprint;
from app.models import Business, Review, Image, User;

businesses_route = Blueprint('businesses', __name__)

@businesses_route.route('/<int:id>')
def get_business(id):
    """
    Query for a business by id and returns that business in a dictionary
    """
    business_data = []
    review_images = {}

    business = Business.query.get(id)
    reviews = Review.query.filter(Review.business_id == id).all()
    business_images = Image.query.filter(Image.imageable_id == id and Image.imageable_type == 'business').all()
    business_image_urls = [{'id': image.id, 'image_url': image.url} for image in business_images]

    total_stars = 0
    num_reviews = len(reviews)

    for review in reviews:
        total_stars += review.stars
        review_images = Image.query.filter(Image.imageable_id == review.id).all()
        review_image_urls = [{'id': image.id, 'image_url': image.url} for image in review_images]
    
    avg_stars = total_stars / num_reviews

    business_dict = business.to_dict()
    print(review_images)
    business_dict['reviews'] = {
        'num_reviews': num_reviews,
        'avg_stars': avg_stars,
    }
    business_dict['review_images'] = review_image_urls
    business_dict['business_images'] = business_image_urls
    
    
    business_data.append(business_dict)
    return { 'business': business_data }


@businesses_route.route('/<int:id>/reviews')
def get_reviews_by_business_id(id):
    reviews = Review.query.filter(Review.business_id == id).all()
    users = User.query.filter(User.id == Review.user_id).all

    user_data = [{
            'id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name
            }
            for user in users]
    
    reviews_list = [{
        'id': review.id,
        'user_id': review.user_id,
        'business_id': review.business_id,
        'review': review.review,
        'stars': review.stars,
        'User': user_data
        } 
        for review in reviews]
    

    return { 'reviews': reviews_list }
