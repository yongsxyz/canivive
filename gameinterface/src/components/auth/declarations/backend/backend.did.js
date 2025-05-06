export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'getStatusProvider' : IDL.Func([], [IDL.Text], ['query']),
    'save_my_profile' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Vec(
            IDL.Record({
              'setting' : IDL.Bool,
              'icon' : IDL.Text,
              'link' : IDL.Text,
              'name' : IDL.Text,
              'type_button' : IDL.Text,
            })
          ),
          IDL.Vec(IDL.Record({ 'link' : IDL.Text, 'platform' : IDL.Text })),
          IDL.Vec(IDL.Record({ 'icon' : IDL.Text, 'tags' : IDL.Text })),
        ],
        [
          IDL.Variant({
            'Ok' : IDL.Record({
              'bio' : IDL.Text,
              'verified' : IDL.Bool,
              'country' : IDL.Text,
              'banner_url' : IDL.Text,
              'avatar_url' : IDL.Text,
              'link' : IDL.Text,
              'name' : IDL.Text,
              'tags' : IDL.Vec(
                IDL.Record({ 'icon' : IDL.Text, 'tags' : IDL.Text })
              ),
              'created_at' : IDL.Text,
              'typechain' : IDL.Text,
              'address' : IDL.Text,
              'user_banned' : IDL.Bool,
              'media_social' : IDL.Vec(
                IDL.Record({ 'link' : IDL.Text, 'platform' : IDL.Text })
              ),
              'button' : IDL.Vec(
                IDL.Record({
                  'setting' : IDL.Bool,
                  'icon' : IDL.Text,
                  'link' : IDL.Text,
                  'name' : IDL.Text,
                  'type_button' : IDL.Text,
                })
              ),
            }),
            'Err' : IDL.Text,
          }),
        ],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
