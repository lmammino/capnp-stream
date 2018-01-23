@0xd508eebdc2dc42b8;

using Cxx = import "/capnp/c++.capnp";

# Use a namespace likely to cause trouble if the generated code doesn't use fully-qualified
# names for stuff in the capnproto namespace.
$Cxx.namespace("capnproto_test::capnp::test");

struct Person {
  name    @0 : Text;
  married @1 : Bool;
}
