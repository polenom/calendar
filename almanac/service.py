from django.core.mail import send_mail


def send(userMail, username, text):
    title = f'Hello, {username.capitalize()}'
    text = f'{text}'
    send_mail(title,
              text,
              'vitalimit88@gmail.com',
              [userMail,],
              fail_silently=False)