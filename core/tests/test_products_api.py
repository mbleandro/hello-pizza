from django.test.testcases import TestCase
from core.tests import fixtures



class TestProductsApi(TestCase):
    @classmethod
    def setUpTestData(cls):
        fixtures.user_jon()

    def test_auth_api(self):
        self.assertEqual(2, 1+1)

