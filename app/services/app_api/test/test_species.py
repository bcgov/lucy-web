import json
import unittest
from main import db
from main.api.models import Category, Species
from test.base import BaseTestCase

# Helper function to add category entries to the DB
def create_category(name):
    category = Category(name=name, icon="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAN1UlEQVR4nO2dT4jdVxXHP2cYQighlOKiixeRdlYuxEUXrsS1exGRUrIRJaYxtqgl/FLMoxTU1tB2UUoXRdCl7rtwoSWGEEoJEiq8gdKM4qKEMIQSwvCOi3vPuef+fr83mUzevLmtcxYzvz/33t+933vu+Xf/PFGUIzp4WjvsCvy/0BHQK6IjoFdE6w9KcGnj1rogx4B11SjPBVBE0n8QVNO92lulpLGHYzT2zgsJnxvLZ0klZFJQWfy5Rd9XQFStMG8PuS0iVfo5sAPc72aT+YM+IYuU4fTpreOIPoPKd0BPAScRqUaAam5MbGT13oBXJL9TFDEUrIGa34+ArZTGDsiBThWR3Nn5qiATet77LTOIpa7KjLcjYKdn3Ae5DfxLVd+/uHlqNl7J/L0xoKcbW8eAHwHngaf6bBWBW4yAswiR2/dGhZ1T43bPV+qjBQwKgOXb6T1VP4cer74NNoJF6vrb9/L/+4peFeRCN5t8sKiOi2T0k8DLwFPpVtJYpHCfJnbzZ0rqcdXcGAq/EDozih+/9EdaN9pGjKrn87I1ZFQDScp9Liqli+8lg5tFTFVmqXtVXqweIJrFY/ruMZRvq+pPpk/fOskCWiSj14D1WgZqERVp6KTxoKE6eXyIVajkZjFT2hAfclXmJwT1/EUWQw1E4b6SKzNF7hTV+jumT2Ixxr32sdjeim1CdZMO0vVdGjnO0Qp3gL8hzH2Y2ZAUAZHMveKVVSU3K78n3dfg5VaFjigcVDhftQxVMXQDp6kWwVWDWDdUiPmi8i55E78E4E1ECDZuc++Wb4r06673EPk78PkYnrAA6IuzyR1VfRP0Uxu/Ntykxzmar+3j1gKx+hl4EXCXDFlZVuLAGmLsEloXILN7ydo46r3KOuqP/vBOQj3s+z5yXFwO61eVm4T++8Cfu9lkhwW00I4W4QOQKcjOuGmmNbjVdwPXYMrDGpk515WcdUHgtmglRE6OQ6GuaxkvZumMAJqu82iE3mhK4rGWI1QM49UzVZIyfQK81M0m/+kjFGkh0N3s1D3gPeC8Cp9VX+8LtshAfRCQIrPFRoS4IK+Kyso0C0bXDbGssW/iHYmjPmqpWAc4gKYFrBhT+MOsqoOGzUW4puj3utnk5jBHTbt6htkQf09gSpLbJABMpftHF1TO3heLJcCLSXVDuxYl4mLB8hbrI5or6v8itlV9NGiMSsT1KixqNjJusrjms3Y73QDOCfLhsOVDWuiwRJpubD1GsqtfAR5Lda+dDLMTit1rJRdL1VKmdmTetk4SCrdb+ZUISKPAtUT+E2V8FOuJcU1oFbEQ5bD6jQnhIso0d7SaGWUKE50j8jFwGri+F68Q9gg0wHTj1nHgxyAXgK/40CZoaq3BjbZQrLhElhr1lYMLogXMmL/npRELiUrV3hsDRD1h+WpnatghpVwF4aog57rZ5NqegMu056BSktnyLugUmNtwTQ0S7y6zQEzOBm2S3/dU94go7ZtS9f8oNnoMmcVLAlFHwaoyOLcXBWdKUkQDk3jbPhHkDOj1BTAtpD1ztNF049Y6yPPABeAJCNyFDdfAzEBQgYWq4E3R7HWq3r0qKsbpPZkcUkY3ezfSUMgD0s6B6wpnLs4mDw0y7CNM2s1O7QDvgL6iynaymTN3VXoqa/8oxCuKZlTNYQO7VYPjUNl7UamGRy7v68/WY6FEFaWfEIrLn24/UjgrqntSfGP00BxtlBXkT4FfA8e9Vi4X+wLO3mUQTO6auTDg8J6G82KGAa0ot2FofVT2bx5q8dnodUo6V/gYOH3xIWVyn/Yd+O9mk8+BN4AO9HYcuzXIaujmBobhatdmfmD5yYX1xQiB87RKr+E65nFLjWLi1WVlzlV1uRziN1dRfe5RQYZHnGHpZpN7wDsgr6qw43auWoW1BlHoGf723Bpb3pRo3VBxxfsoXiqXX/O3cn8JUgJOZhJKMUUl1DFbKzNUz4rszU5+EO1bdES6tLG1LuiLIL9UeDxycDSUY2xBVLLZWuzlvriJStVMPaJcDWLKmLP6xm6KNb5Rs2AEYJ6sCjnT7VPxjdFS5gwvziY7IG8BrwLbydUWj74lky8M0WwSSAC3tmMTSfVfQ3n4KKgUmo17zNJRf6YDkIvGtWhd6h79EOQssBRO9rYsc13HdGPrBPA8adLgWHw35hTEq/FZm8Vc2KfC9T70fTQNRkocESXfHNGbgpxeJicbLXUWvJtN7qK8DvoycNtfhMYWzyyRc6tzoGfyvOmuZ5z1bMBiv6eYhE8aV52bYxmQRoRqGC1cEeS5gwAZDmC5Qbc5uYfK24q+prATxjWjVm0vdFoHLkwzZXtc8/OKS4NJCDl9Fkc2pRXKK16sRHHyMXC2m02WKi4iHci6jm5zckeQ3wFTkG3yjEnSjQEwCBwX5vKczDC2S3c1SpJgUrpSs9xSK0dC7hwDmaNcRXm2m00+WkLTF9KBLaDpZpP7ApeB3yJ61xTkuNjNAEqwVgCoA/jF4elnj4qxhHHdUvFPmk3nGa8BZ7vNUwciLiId6EqlbjbZBt5Q5HWUneg4OAVxUL8yGVqC9TmlJ/IYdXiqJh56M+M2p5i7YS7CTZCz3ebByOQ+LdXqWETTja3jwIsKLwg8vrstkSZahxMkA6sakMHT8lyDvW1vFEHmCh8InDtocRFpJWvvkgepbwn8XtEdd+AG0zLZsRlTmv3glAfi80O3QtIfs98J4iSXcFN0tSDDijja6NLG1nGBjmRrn7Dn/WVXUQnGxTr9AP544B4vx2zlTHPgGnDmIK2LRbRSoAGmG1snQV8A+TmqJ2oZkQVAFWzuCRoNrs3AGglWjQ2b0rwriByoCbcbrRxogEtP3zopIi8Bv0BZs5gFDM009WdgbjjUfeELG3vlBLoJ+mw3O3UoIMMhAQ1JQarqBRF5HjiZcCxxir62LEGjrOxCzMTVnxaAc3lzSSuuznWzUzdW1LRROjSgAaYbW08oel6QXxHXAVYR/HFrY1ykDDj5BvBsN5scKshwyCv+u9nktiCvApdBy7q1avHF0NWun5sJXnmVc+AKcLoFkKGBrRXdbPI5qq+AXFb0LjCMf0AwRPpmXu6X4G6DXuGQrItFdKiiI9J0Y+tx0rTYz4C1YjdrECFQ++gSxIybfjdRfthtrtZOfhAdOkcbdbPJHeCCwm9AtqPJ5rNjHpwSd9eTZy2oMheRv6ry/dZAhoaAhuRBCvKaom+D7AA+o+L/RarVCVLCpjdQPX9xc/LPQ2vALtSM6IiUZ2r+DeStCv1IRqawoIak+N5bZT0fhpriaKNuNrkLOifbxhoVYojwucpM93dXX9O90wP3GR4WWXipv8AmcnOZ2KXBcVlTkxwNYZbEH8TlukRbzrzAFdVsf9QsR3u4M0zqltiyRqsup1kc4W6BmgW6uNMxYBRESG+/SX/nQ2vUrujozXIb2GVioHFke9Qs0FBCnhruywLI5sVyRc2KDiiWsy2+7/OwLLhukRrmaDXXOlNYWl4Z1viakZapYY6O53/EJTMlhKrBjm6dGuboMK2ljiwD10TjZvp2qWmgjXzZi01jZVDFlWNK1TI1DXR9nENYfRS8Q9+/eMTR+yQNi2AyxYU1tlW5PhukXWoW6Hj8Rv9UA1ujlMS32SJtQ90s0Cn8mZScVAsWcwxaLLpnb45Exz6p7JCtZ2gtqKTVfevCo2E7Guw0g8FjWzijRYwcmXePQNUCUSAIbfpvWqeGgVafp5LB5k6K16hfDBe8YaClrJ/xEwjCAkhfNRrW6zVMDcvoeJiV+lSW9Kew/FnbPN0sR9c7ryx4VJ8aZiZeNVPeKDULdCUIehvv/VHeYGQLa1qmhkUHuH0cV/+XNXa4m6Lt29HNcjTBkihTWlIpPdv+5uc4NUztcrRE9zrLaGNwT/IFWDmTqWmO9qmqXnDJZla+ABLDqV2gbVGMBixlxLoYnH7QJrULNBQQwy4tAfcUy+QszYuQdoF2JyXsB7dpLCm7spITQ/MipGllGHfExqM5o4fYuutt1C5HB+GslFNwbbFjPHVXW3cLaRnooAR97jA7KuUon/KsddnRLtCViVy2VdQXlq4c29kqHcgelrSxnieBYyOnDCSqtrXl6akgcVX1H4icMM+v/i0V8azh7LwXgPf3PL3lrz2Ocgf4727n9D8KLR3o6catr4F0oN8AOT6eajcQMnrC11HWipggdI7dKr4zCz4Ftr0I+kvFdgV+Dnym6F8E3s3H7i+Vlmp15N1UbwLfBVkrB3gTgkEp7eB3tdyMK6cUiFC2uoFzvKX1JWOpzK/6B8QmZ4aniY0yvE8gyLdInfWHZeICy5fR3wSeSeWWBYplFqQndbUAYieJ+VCOpxRQHiVcC2hx1qXP7dVZe3EvRkVFtkk6Vv+5R2j/Qlo20Mcg/XCZIjUo0VwzDsfiySX6VptuPTGRE6QwtJqb6JxtZmCU54Xi76kUs7A88y9VJ1Aui5YN9HXgRpkfCS7yYMZECsfbYyQvjilHt3kHVMt3i9rUUKR4p9XiQkRQ0aos66DesuB7qvLH5cFRaNlHZm4DF0i/tHPXf68qcK+LVLs2sD0EqoV7sSW5iapjreIpNUpKNyJufCDYPnItpeUvmGT7FLgs8KflIVLoIFzw6wo/AE4Kumbqq5ywm1OFxTF+4kw2FQpDSqUMU1qqmfHC9UXUxA1bMfLnoyCOFCtRuI/qZ93m8i2OXKe2Df0vC7XrGX7J6AjoFdER0Cui/wHGDLnjzPt5HgAAAABJRU5ErkJggg==")
    db.session.add(category)
    db.session.commit()
    return category

# Helper function to add species entries to the DB
def create_species(name, latin, description, introduced, catid):
    species = Species(name=name, latin=latin, description=description, introduced=introduced, catid=catid)
    db.session.add(species)
    db.session.commit()
    return species

# Tests for the Species Service
class TestSpeciesService(BaseTestCase):
    # Basic happy path, ensure the /species route behaves correctly
    def test_get_species(self):
        category = create_category('Mammal')
        species = create_species('Norway rat', 'Rattus norvegicus', 'Brown or dark grey in colour.', '1880-01-01', category.id)
        with self.client:
            response = self.client.get('/api/v1/species')
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(data['species']), 1)
            self.assertIn(species.name, data['species'][0]['name'])
            self.assertIn(species.latin, data['species'][0]['latin'])
            self.assertIn(species.introduced.strftime('%Y-%m-%d'), data['species'][0]['introduction'])
            self.assertIn(category.name, data['species'][0]['category'])

    # Basic happy path, ensure the /species route behaves correctly for POST
    def test_species_creation(self):
        category = create_category('Plant')
        with self.client:
            response = self.client.post('/api/v1/species',
                data=json.dumps({
                    'name': 'Giant hogweed',
                    'latin': 'Heracleum mantegazzianum',
                    'introduction': '1920-01-01',
                    'description': 'Small white flower clusters in an umbrella-shaped head.',
                    'category': 'Plant'
                }),
                content_type='application/json',
            )
        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 201)
        self.assertIsNotNone(data['id'])
        self.assertIn('Giant hogweed', data['name'])
        self.assertIn('Heracleum mantegazzianum', data['latin'])
        self.assertIn('1920-01-01', data['introduction'])
        self.assertIn('Small white flower clusters in an umbrella-shaped head.', data['description'])
        self.assertIn('Plant', data['category'])

    # Basic happy path, ensure the /species/<id> route behaves correctly
    def test_get_single_species(self):
        category = create_category('Mammal')
        species = create_species('Norway rat', 'Rattus norvegicus', 'Brown or dark grey in colour.', '1880-01-01', category.id)
        with self.client:
            response = self.client.get('/api/v1/species/%d' % species.id)
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 200)
            self.assertEqual(species.id, data['id'])
            self.assertIn(species.name, data['name'])
            self.assertIn(species.latin, data['latin'])
            self.assertIn(species.description, data['description'])
            self.assertIn(species.introduced.strftime('%Y-%m-%d'), data['introduction'])
            self.assertIn(category.name, data['category'])

    # Basic happy path, ensure the /species/<id> PUT route behaves correctly
    def test_put_single_species(self):
        category = create_category('Mammal')
        species = create_species('Norway rat', 'Rattus norvegicus', 'Brown or dark grey in colour.', '1880-01-01', category.id)
        with self.client:
            response = self.client.put('/api/v1/species/%d' % species.id,
                data=json.dumps({
                    'id': species.id,
                    'name': species.name,
                    'latin': species.latin,
                    'description': 'Brown or dark grey in colour with a lighter undercoat.',
                    'introduction': species.introduced.strftime('%Y-%m-%d'),
                    'category': category.name
                }),
                content_type='application/json',
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 200)
            self.assertEqual(species.id, data['id'])
            self.assertIn(species.name, data['name'])
            self.assertIn(species.latin, data['latin'])
            self.assertIn('Brown or dark grey in colour with a lighter undercoat.', data['description'])
            self.assertIn(species.introduced.strftime('%Y-%m-%d'), data['introduction'])
            self.assertIn(category.name, data['category'])

    # Basic happy path, ensure the /species/<id> DELETE route behaves correctly
    def test_delete_single_species(self):
        category = create_category('Mammal')
        species = create_species('Norway rat', 'Rattus norvegicus', 'Brown or dark grey in colour.', '1880-01-01', category.id)
        with self.client:
            response = self.client.delete('/api/v1/species/%d' % species.id)
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 200)
            self.assertIn('Successfully deleted species.', data['status'])

if __name__ == '__main__':
    unittest.main()