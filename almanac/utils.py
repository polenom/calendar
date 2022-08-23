from accounts.models import Country


class DateCountryMixin:
    def get_county_context(self, context):
        counties = Country.objects.all()
        context['countries'] = counties
        return  context