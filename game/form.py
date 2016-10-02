from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django import forms

# we have to redefine widgets to use bootstrap CSS


class LoginForm(AuthenticationForm):
    username = forms.CharField(label="Username", max_length=30,
                               widget=forms.TextInput(attrs={'class': 'form-control', 'name': 'username'}))
    password = forms.CharField(label="Password", max_length=30,
                               widget=forms.PasswordInput(attrs={'class': 'form-control', 'name': 'password', 'type': 'password'}))


class RegistrationForm(UserCreationForm):
    username = forms.CharField(label="Username", max_length=30,
                               widget=forms.TextInput(attrs={'class': 'form-control', 'name': 'username'}))
    password1 = forms.CharField(label="Password", max_length=30,
                                widget=forms.PasswordInput(attrs={'class': 'form-control', 'name': 'password1', 'type': 'password'}))
    password2 = forms.CharField(label="Re-enter password", max_length=30,
                                widget=forms.PasswordInput(attrs={'class': 'form-control', 'name': 'password2', 'type': 'password'}))
    email = forms.EmailField(label="Email address", max_length=30)