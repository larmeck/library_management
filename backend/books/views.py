from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Book
from .serializers import BookSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken


class BookListCreateView(APIView):

    def get(self, request):
        try:
            books = Book.objects.all()
            serializer = BookSerializer(books,many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def post(self, request):
        serializer = BookSerializer(data=request.data)

        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data,status=status.HTTP_201_CREATED)

            except Exception as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class BookDetailView(APIView):

    def get_object(self, pk):
        try:
            return Book.objects.get(pk=pk)

        except Book.DoesNotExist:
            return None

    def get(self, request, pk):
        book = self.get_object(pk)

        if book is None:
            return Response(
                {"error": "Book not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = BookSerializer(book)
        return Response(serializer.data)


    def put(self, request, pk):
        book = self.get_object(pk)

        if book is None:
            return Response(
                {"error": "Book not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = BookSerializer(book,data=request.data)


        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data)

            except Exception as e:
                return Response(
                    {"error": str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


    def delete(self, request, pk):
        book = self.get_object(pk)

        if book is None:
            return Response(
                {"error": "Book not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            book.delete()
            return Response(
                {"message": "Book deleted successfully"},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class MeView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        return Response({
            "id": request.user.id,
            "username": request.user.username,
            "email": request.user.email
        })


class LogoutView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        try:

            refresh_token = request.data.get("refresh")

            if not refresh_token:
                return Response(
                    {"error": "Refresh token is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            token = RefreshToken(refresh_token)

            token.blacklist()

            return Response(
                {"message": "Successfully logged out"},
                status=status.HTTP_200_OK
            )

        except Exception:

            return Response(
                {"error": "Invalid refresh token"},
                status=status.HTTP_400_BAD_REQUEST
            )
