from django.db import models
from django.contrib.auth.models import User
from solo.models import SingletonModel

class ActivityLog(models.Model):
    type = models.CharField(max_length=64)
    logged_user = models.ForeignKey(User, null=True, blank=True)
    fromuser = models.ForeignKey(User, null=True, blank=True, related_name="activitylogs_withfromuser")
    jsondata = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField('criado em', auto_now_add=True)

    class Meta:
        ordering = ('-created_at',)

    def __str__(self):
        return '%s / %s / %s' % (
            self.type,
            self.logged_user,
            self.created_at,
        )

class Product(models.Model):
    photo = models.ImageField(upload_to='images/')
    name = models.CharField(max_length=64)
    description = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return self.name 

    class Meta:
        verbose_name = "Pizza"

class Config(SingletonModel):
    site_name = models.CharField(max_length=255, default='Hello Pizza')
    frete = models.DecimalField(max_digits=5, decimal_places=2, default=5.00)
    borda_price = models.DecimalField(max_digits=5, decimal_places=2, default=2.00)
    year = models.IntegerField(default=2021)
    phone = models.CharField(max_length=13, default='5512981246322')
    maintenance_mode = models.BooleanField(default=False)

    def __str__(self):
        return "Configurações"

    class Meta:
        verbose_name = "Configuraçõe"

    def _to_dict(self):
        return {
            'site_name': self.site_name,
            'frete': self.frete,
            'borda_price': self.borda_price,
            'year': self.year,
            'phone': self.phone,
            'maintenance_mode': self.maintenance_mode
        }

class Edge(models.Model):
    recheio = models.CharField(max_length=32)
    price = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return self.recheio
    
    class Meta:
        verbose_name = "Borda"