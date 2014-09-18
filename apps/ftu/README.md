# First time experience 2.2!

Update your source and flash onto your FxOS device by running:

```
git remote add giovanni git@github.com:giovannic/gaia.git
git checkout -b newrebasedftu giovanni/newrebasedftu
make install-gaia APP=ftu
```

### Features
My feature branches for the this ftu are prefixed with 'ftu-'. This is a merge
of those branches.

- ftu-wifi: a smoother wifi page
- ftu-tz: a simplification of the timezone screen 
- ftu-flow: a user flow that is aware of network connectivity br
- ftu-nav2: a navigation that has option lists instead of the standard next/back
buttons

For any features, feel free to post an issue and I will work on it!
