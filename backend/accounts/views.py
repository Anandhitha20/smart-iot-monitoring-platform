from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .models import Profile


# LOGIN -------------------------------------------------
@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):

    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)

    if user is None:
        return Response({"error": "Invalid credentials"}, status=401)

    token, created = Token.objects.get_or_create(user=user)

    return Response({
        "token": token.key,
        "username": user.username
    })


# LOGOUT ------------------------------------------------
@api_view(["POST"])
def logout_view(request):

    request.user.auth_token.delete()

    return Response({"message": "Logged out successfully"})


# USER PROFILE -------------------------------

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_profile(request):

    user = request.user

    profile, created = Profile.objects.get_or_create(user=user)

    return Response({
        "username": user.username,
        "email": user.email,
        "phone": profile.phone,
        "address": profile.address,
        "role": profile.role,
        "date_joined": user.date_joined,
        "last_login": user.last_login
    })

# UPDATE PROFILE -----------------------------------
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_profile(request):

    user = request.user
    profile, created = Profile.objects.get_or_create(user=user)

    user.email = request.data.get("email", user.email)
    user.save()

    profile.phone = request.data.get("phone", profile.phone)
    profile.address = request.data.get("address", profile.address)
    profile.role = request.data.get("role", profile.role)

    profile.save()

    return Response({"message": "Profile updated successfully"})