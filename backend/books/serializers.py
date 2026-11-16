
from rest_framework import serializers
from .models import Book
from datetime import date


class BookSerializer(serializers.ModelSerializer):

    class Meta:
        model = Book

        fields = [
            "id",
            "title",
            "author",
            "price",
            "published_year"
        ]




    def validate_published_year(self, value):

        current_year = date.today().year

        if value > current_year:
            raise serializers.ValidationError(
                "Published year cannot be in the future."
            )

        elif len(str(value)) != 4:
            raise serializers.ValidationError(
                "Invalid year. Year must contain 4 digits."
            )

        return value





    def validate_price(self, value):

        if value <= 0:
            raise serializers.ValidationError(
                "Price must be greater than zero."
            )

        return value
